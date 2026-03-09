import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  HomeTelecomService,
  LiveScoresState,
  TelecomNewsItem,
} from '../core/services/home-telecom.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  private readonly fallbackImages = [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=70',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=70',
    'https://picsum.photos/seed/telecom/900/600',
  ];

  tab: 'recientes' | 'proximos' | 'noticias' = 'recientes';

  recientes = [] as LiveScoresState['recientes'];
  proximos = [] as LiveScoresState['proximos'];
  noticias = [] as TelecomNewsItem[];

  loading = true;
  loadingNoticias = true;
  errorMsg = '';

  private readonly refetchInterval = 1000 * 60;
  private liveSub?: Subscription;
  private newsSub?: Subscription;

  constructor(private telecomService: HomeTelecomService) {}

  ngOnInit(): void {
    this.loadLive();
    this.loadNews();
  }

  ngOnDestroy(): void {
    this.liveSub?.unsubscribe();
    this.newsSub?.unsubscribe();
  }

  refresh(): void {
    this.loadLive();
    this.loadNews();
  }

  getImageSrc(imageUrl?: string): string {
    const candidate = imageUrl?.trim();
    return candidate ? candidate : this.fallbackImages[0];
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (!img) {
      return;
    }

    const currentIndex = Number(img.getAttribute('data-fallback-index') ?? '0');
    const nextIndex = currentIndex + 1;

    if (nextIndex < this.fallbackImages.length) {
      img.src = this.fallbackImages[nextIndex];
      img.setAttribute('data-fallback-index', String(nextIndex));
      return;
    }

    img.src = this.fallbackImages[this.fallbackImages.length - 1];
  }

  private loadLive(): void {
    this.loading = true;
    this.errorMsg = '';

    this.liveSub?.unsubscribe();
    this.liveSub = this.telecomService.useLiveScores(this.refetchInterval).subscribe({
      next: (state) => {
        this.recientes = state.recientes;
        this.proximos = state.proximos;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMsg =
          'No se pudieron cargar eventos de telecomunicaciones. Intenta nuevamente en unos segundos.';
      },
    });
  }

  private loadNews(): void {
    this.loadingNoticias = true;
    this.newsSub?.unsubscribe();

    this.newsSub = this.telecomService.getNoticias().subscribe({
      next: (items) => {
        this.noticias = items;
        this.loadingNoticias = false;
      },
      error: () => {
        this.loadingNoticias = false;
        this.errorMsg =
          'No se pudieron cargar noticias de telecomunicaciones. Si estás en navegador local, puede ser un bloqueo CORS.';
      },
    });
  }
}
