import {
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';

type TelecomItem = {
  title: string;
  subtitle: string;
  date: string;
  url?: string;
  imageUrl?: string;
};

type TelecomNewsItem = {
  title: string;
  source: string;
  date: string;
  url: string;
  imageUrl?: string;
};

type CachedPayload<T> = {
  expiresAt: number;
  payload: ApiResponse<T>;
};

type ApiResponse<T> = {
  data: T;
  meta: {
    source: string;
    cached: boolean;
    updatedAt: string;
  };
};

type LaunchLibraryResponse = {
  results?: Array<{
    name?: string;
    net?: string;
    window_start?: string;
    status?: { name?: string };
    launch_service_provider?: { name?: string };
    mission?: { description?: string; type?: string; name?: string };
    url?: string;
    image?: string;
  }>;
};

type HackerNewsResponse = {
  hits?: Array<{
    title?: string;
    story_title?: string;
    url?: string;
    story_url?: string;
    created_at?: string;
    author?: string;
  }>;
};

type SpaceflightNewsResponse = {
  results?: Array<{
    title?: string;
    news_site?: string;
    published_at?: string;
    url?: string;
    image_url?: string;
  }>;
};

@Injectable()
export class TelecomService {
  private readonly timeoutMs = Number(process.env.TELECOM_TIMEOUT_MS ?? 8000);
  private readonly cacheTtlMs = Number(process.env.TELECOM_CACHE_TTL_MS ?? 60000);
  private readonly cache = new Map<string, CachedPayload<unknown>>();

  private readonly telecomKeywords = [
    'telecom',
    'telecommunications',
    '5g',
    '4g',
    'fiber',
    'fibre',
    'broadband',
    'satellite',
    'communication',
    'network',
    'iot',
    'lte',
  ];

  async getRecientes(limit: number): Promise<ApiResponse<TelecomItem[]>> {
    const cacheKey = `recientes:${limit}`;

    return this.withCache(cacheKey, async () => {
      const url = `https://ll.thespacedevs.com/2.2.0/launch/previous/?limit=${limit}&search=satellite`;
      let json: LaunchLibraryResponse;

      try {
        json = await this.fetchJson<LaunchLibraryResponse>(url);
      } catch {
        return {
          data: this.buildFallbackRecientes(limit),
          meta: {
            source: 'Fallback local backend',
            cached: false,
            updatedAt: new Date().toISOString(),
          },
        };
      }

      const data = (json.results ?? [])
        .filter(item =>
          this.isTelecomText(
            `${item.name ?? ''} ${item.mission?.name ?? ''} ${item.mission?.description ?? ''} ${item.mission?.type ?? ''}`,
          ),
        )
        .map(item => ({
          title: item.name ?? 'Evento reciente de telecomunicaciones',
          subtitle: `${item.launch_service_provider?.name ?? 'Proveedor no especificado'} · ${item.status?.name ?? 'Estado no disponible'}`,
          date: item.window_start ?? item.net ?? new Date().toISOString(),
          url: item.url,
          imageUrl: item.image,
        }));

      return {
        data: data.length > 0 ? data : this.buildFallbackRecientes(limit),
        meta: {
          source: 'Launch Library 2',
          cached: false,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }

  async getProximos(limit: number): Promise<ApiResponse<TelecomItem[]>> {
    const cacheKey = `proximos:${limit}`;

    return this.withCache(cacheKey, async () => {
      const url = `https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=${limit}&search=satellite`;
      let json: LaunchLibraryResponse;

      try {
        json = await this.fetchJson<LaunchLibraryResponse>(url);
      } catch {
        return {
          data: this.buildFallbackProximos(limit),
          meta: {
            source: 'Fallback local backend',
            cached: false,
            updatedAt: new Date().toISOString(),
          },
        };
      }

      const data = (json.results ?? [])
        .filter(item =>
          this.isTelecomText(
            `${item.name ?? ''} ${item.mission?.name ?? ''} ${item.mission?.description ?? ''} ${item.mission?.type ?? ''}`,
          ),
        )
        .map(item => ({
          title: item.name ?? 'Próximo evento de telecomunicaciones',
          subtitle: `${item.launch_service_provider?.name ?? 'Proveedor no especificado'} · ${item.status?.name ?? 'Pendiente'}`,
          date: item.window_start ?? item.net ?? new Date().toISOString(),
          url: item.url,
          imageUrl: item.image,
        }));

      return {
        data: data.length > 0 ? data : this.buildFallbackProximos(limit),
        meta: {
          source: 'Launch Library 2',
          cached: false,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }

  async getNoticias(limit: number): Promise<ApiResponse<TelecomNewsItem[]>> {
    const cacheKey = `noticias:${limit}`;

    return this.withCache(cacheKey, async () => {
      const hnUrl = `https://hn.algolia.com/api/v1/search_by_date?query=telecommunications%20OR%205G%20OR%20fiber%20network&tags=story&hitsPerPage=${limit}`;
      let hnJson: HackerNewsResponse;

      try {
        hnJson = await this.fetchJson<HackerNewsResponse>(hnUrl);
      } catch {
        return {
          data: this.buildFallbackNoticias(limit),
          meta: {
            source: 'Fallback local backend',
            cached: false,
            updatedAt: new Date().toISOString(),
          },
        };
      }

      const hnData = (hnJson.hits ?? [])
        .filter(item =>
          this.isTelecomText(
            `${item.title ?? ''} ${item.story_title ?? ''} ${item.url ?? ''} ${item.story_url ?? ''}`,
          ),
        )
        .map(item => ({
          title: item.title ?? item.story_title ?? 'Noticia de telecomunicaciones',
          source: item.author ? `Hacker News · ${item.author}` : 'Hacker News',
          date: item.created_at ?? new Date().toISOString(),
          url: item.url ?? item.story_url ?? 'https://news.ycombinator.com/',
          imageUrl:
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=70',
        }));

      if (hnData.length > 0) {
        return {
          data: hnData,
          meta: {
            source: 'Hacker News API',
            cached: false,
            updatedAt: new Date().toISOString(),
          },
        };
      }

      const altUrl = `https://api.spaceflightnewsapi.net/v4/articles/?search=satellite&limit=${limit}`;
      let altJson: SpaceflightNewsResponse;

      try {
        altJson = await this.fetchJson<SpaceflightNewsResponse>(altUrl);
      } catch {
        return {
          data: this.buildFallbackNoticias(limit),
          meta: {
            source: 'Fallback local backend',
            cached: false,
            updatedAt: new Date().toISOString(),
          },
        };
      }

      const altData = (altJson.results ?? []).map(item => ({
        title: item.title ?? 'Noticia de telecomunicaciones',
        source: item.news_site ?? 'Spaceflight News',
        date: item.published_at ?? new Date().toISOString(),
        url: item.url ?? 'https://api.spaceflightnewsapi.net/',
        imageUrl: item.image_url,
      }));

      return {
        data: altData.length > 0 ? altData : this.buildFallbackNoticias(limit),
        meta: {
          source: altData.length > 0 ? 'Spaceflight News API' : 'Fallback local backend',
          cached: false,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }

  private async withCache<T>(
    key: string,
    producer: () => Promise<ApiResponse<T>>,
  ): Promise<ApiResponse<T>> {
    const cached = this.cache.get(key) as CachedPayload<T> | undefined;
    const now = Date.now();

    if (cached && cached.expiresAt > now) {
      return {
        ...cached.payload,
        meta: {
          ...cached.payload.meta,
          cached: true,
        },
      };
    }

    try {
      const payload = await producer();
      this.cache.set(key, {
        expiresAt: now + this.cacheTtlMs,
        payload,
      });
      return payload;
    } catch {
      if (cached) {
        return {
          ...cached.payload,
          meta: {
            ...cached.payload.meta,
            cached: true,
          },
        };
      }

      throw new ServiceUnavailableException(
        'No fue posible consultar la API externa en este momento. Intenta nuevamente en unos segundos.',
      );
    }
  }

  private async fetchJson<T>(url: string): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Upstream status ${response.status}`);
      }

      return (await response.json()) as T;
    } finally {
      clearTimeout(timeout);
    }
  }

  private isTelecomText(raw: string): boolean {
    const text = raw.toLowerCase();
    return this.telecomKeywords.some(keyword => text.includes(keyword));
  }

  private buildFallbackRecientes(limit: number): TelecomItem[] {
    const now = new Date();
    const items: TelecomItem[] = [
      {
        title: 'Actualización de red troncal de fibra óptica',
        subtitle: 'Monitoreo NEDETEL · Estado: completado',
        date: new Date(now.getTime() - 1000 * 60 * 45).toISOString(),
        url: 'https://www.itu.int/',
        imageUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Optical_fiber_cable.jpg/640px-Optical_fiber_cable.jpg',
      },
      {
        title: 'Despliegue satelital para enlaces de telecomunicaciones',
        subtitle: 'Infraestructura satelital · Estado: validado',
        date: new Date(now.getTime() - 1000 * 60 * 120).toISOString(),
        url: 'https://www.gsma.com/',
        imageUrl:
          'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?auto=format&fit=crop&w=900&q=70',
      },
      {
        title: 'Optimización LTE/5G en nodos urbanos',
        subtitle: 'Operación de red · Estado: estable',
        date: new Date(now.getTime() - 1000 * 60 * 240).toISOString(),
        url: 'https://www.etsi.org/',
        imageUrl:
          'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=70',
      },
    ];

    return items.slice(0, limit);
  }

  private buildFallbackProximos(limit: number): TelecomItem[] {
    const now = new Date();
    const items: TelecomItem[] = [
      {
        title: 'Próxima ventana de mantenimiento de backbone IP',
        subtitle: 'Programado por operaciones de telecomunicaciones',
        date: new Date(now.getTime() + 1000 * 60 * 60 * 6).toISOString(),
        url: 'https://www.ietf.org/',
        imageUrl:
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=70',
      },
      {
        title: 'Integración de nuevos enlaces de transmisión',
        subtitle: 'Expansión de cobertura regional',
        date: new Date(now.getTime() + 1000 * 60 * 60 * 24).toISOString(),
        url: 'https://www.itu.int/',
        imageUrl:
          'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?auto=format&fit=crop&w=900&q=70',
      },
      {
        title: 'Actualización de plataformas de monitoreo NOC',
        subtitle: 'Plan de continuidad telecom',
        date: new Date(now.getTime() + 1000 * 60 * 60 * 48).toISOString(),
        url: 'https://www.tmforum.org/',
        imageUrl:
          'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=900&q=70',
      },
    ];

    return items.slice(0, limit);
  }

  private buildFallbackNoticias(limit: number): TelecomNewsItem[] {
    const now = new Date();
    const items: TelecomNewsItem[] = [
      {
        title: 'Resumen actualizado del sector de telecomunicaciones',
        source: 'ITU',
        date: now.toISOString(),
        url: 'https://www.itu.int/',
        imageUrl:
          'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=70',
      },
      {
        title: 'Tendencias 5G, fibra y conectividad satelital',
        source: 'GSMA',
        date: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
        url: 'https://www.gsma.com/',
        imageUrl:
          'https://images.unsplash.com/photo-1591696331111-ef9586a5b17d?auto=format&fit=crop&w=900&q=70',
      },
      {
        title: 'Estándares recientes para redes y servicios telecom',
        source: 'ETSI',
        date: new Date(now.getTime() - 1000 * 60 * 90).toISOString(),
        url: 'https://www.etsi.org/',
        imageUrl:
          'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=900&q=70',
      },
    ];

    return items.slice(0, limit);
  }
}
