import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap, timer } from 'rxjs';
import { getApiBaseUrl } from 'src/app/core/config/api.config';

export interface TelecomItem {
  title: string;
  subtitle: string;
  date: string;
  url?: string;
  imageUrl?: string;
}

export interface TelecomNewsItem {
  title: string;
  source: string;
  date: string;
  url: string;
  imageUrl?: string;
}

export interface LiveScoresState {
  recientes: TelecomItem[];
  proximos: TelecomItem[];
}

interface TelecomApiResponse<T> {
  data: T;
  meta: {
    source: string;
    cached: boolean;
    updatedAt: string;
  };
}

@Injectable({ providedIn: 'root' })
export class HomeTelecomService {
  constructor(private readonly http: HttpClient) {}

  private readonly refetchInterval = 1000 * 60;
  private readonly baseUrl = `${getApiBaseUrl()}/telecom`;

  private readonly headers = new HttpHeaders({
    'x-app-client': 'nedetel-web',
  });

  useLiveScores(refetchInterval: number = this.refetchInterval): Observable<LiveScoresState> {
    return timer(0, refetchInterval).pipe(
      switchMap(() =>
        forkJoin({
          recientes: this.getRecentes(),
          proximos: this.getProximos(),
        })
      )
    );
  }

  getNoticias(): Observable<TelecomNewsItem[]> {
    const params = new HttpParams().set('limit', '10');

    return this.http
      .get<TelecomApiResponse<TelecomNewsItem[]>>(`${this.baseUrl}/noticias`, {
        headers: this.headers,
        params,
      })
      .pipe(map(response => response.data));
  }

  private getRecentes(): Observable<TelecomItem[]> {
    const params = new HttpParams().set('limit', '10');

    return this.http
      .get<TelecomApiResponse<TelecomItem[]>>(`${this.baseUrl}/recientes`, {
        headers: this.headers,
        params,
      })
      .pipe(map(response => response.data));
  }

  private getProximos(): Observable<TelecomItem[]> {
    const params = new HttpParams().set('limit', '10');

    return this.http
      .get<TelecomApiResponse<TelecomItem[]>>(`${this.baseUrl}/proximos`, {
        headers: this.headers,
        params,
      })
      .pipe(map(response => response.data));
  }
}
