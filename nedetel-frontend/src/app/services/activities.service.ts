import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export interface ActivityItem {
  id: string;
  module: string;
  title: string;
  description?: string;
  dateISO: string;
  createdAtISO: string;
}

@Injectable({ providedIn: 'root' })
export class ActivitiesService {
  private storageKey(module: string) {
    return `nedetel_activities_${module}`;
  }

  private uuid() {
    // Compatible en webview; fallback seguro
    // @ts-ignore
    return crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random()}`;
  }

  async list(module: string): Promise<ActivityItem[]> {
    const { value } = await Preferences.get({ key: this.storageKey(module) });
    if (!value) return [];

    try {
      const parsed = JSON.parse(value) as ActivityItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async add(
    module: string,
    item: Omit<ActivityItem, 'id' | 'module' | 'createdAtISO'>
  ): Promise<ActivityItem> {
    const list = await this.list(module);

    const newItem: ActivityItem = {
      id: this.uuid(),
      module,
      createdAtISO: new Date().toISOString(),
      ...item,
    };

    list.unshift(newItem);

    await Preferences.set({
      key: this.storageKey(module),
      value: JSON.stringify(list),
    });

    return newItem;
  }

  async remove(module: string, id: string): Promise<void> {
    const list = (await this.list(module)).filter((x) => x.id !== id);

    await Preferences.set({
      key: this.storageKey(module),
      value: JSON.stringify(list),
    });
  }

  async clear(module: string): Promise<void> {
    await Preferences.remove({ key: this.storageKey(module) });
  }
}