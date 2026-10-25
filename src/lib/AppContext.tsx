'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import {
  CLIENT_PROFILES,
  LOCATIONS,
  DIVISIONS,
  ROADS,
  BLOG_POSTS,
  DEFAULT_SITE_SETTINGS,
  ClientProfile,
  Location,
  Division,
  Road,
  BlogPost,
  ProfileStatus,
  MediaItem,
  SiteSettings,
  ListingTier,
  NearbyPlace,
  MicroLocation,
  VisibilityPackageConfig,
  VisibilityPackageTier,
} from '@/lib/mockData';
import { dbService } from '@/lib/services/dbService';

interface AppState {
  clients: ClientProfile[];
  locations: Location[];
  divisions: Division[];
  roads: Road[];
  blogPosts: BlogPost[];
  searchLocation: string;
  shuffleIntervalMinutes: number;
  clientsPerPage: number;
  siteSettings: SiteSettings;
}

interface AppContextValue extends AppState {
  // Search
  setSearchLocation: (loc: string) => void;

  // Admin: clients
  togglePin: (id: string) => void;
  toggleStatus: (id: string, status: ProfileStatus) => void;
  toggleHidden: (id: string) => void;
  deleteClient: (id: string) => void;
  setUploadLimit: (id: string, limit: number) => void;
  setMediaLimits: (id: string | 'all', photos: number, videos: number) => void;
  moveFeaturedUp: (id: string) => void;
  moveFeaturedDown: (id: string) => void;
  addClient: (client: ClientProfile) => void;
  toggleVerified: (id: string) => void;
  setClientTier: (id: string, tier: ListingTier) => void;
  updateClientPassword: (id: string, newPassword: string) => void;
  adminUpdateClient: (id: string, data: Partial<ClientProfile>) => void;
  setSellerVisibilityPackage: (id: string, pkg: VisibilityPackageConfig) => void;
  endSellerFreeTrial: (id: string) => void;

  // Admin: locations
  addLocation: (loc: Location) => void;
  updateLocation: (id: string, name: string, area: string) => void;
  deleteLocation: (id: string) => void;

  // Admin: divisions
  addDivision: (div: Division) => void;
  updateDivision: (id: string, name: string, subcounty: string, county: string) => void;
  deleteDivision: (id: string) => void;

  // Admin: roads
  addRoad: (road: Road) => void;
  updateRoad: (id: string, name: string, county: string) => void;
  deleteRoad: (id: string) => void;

  // Admin: blog
  saveBlogPost: (post: BlogPost) => void;
  toggleBlogPublish: (id: string) => void;
  deleteBlogPost: (id: string) => void;

  // Admin: settings
  setShuffleInterval: (minutes: number) => void;
  setClientsPerPage: (count: number) => void;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  setCompulsoryProductFields: (fields: string[]) => void;

  // Admin: nearby places
  addNearbyPlace: (place: NearbyPlace) => void;
  updateNearbyPlace: (id: string, data: Partial<NearbyPlace>) => void;
  deleteNearbyPlace: (id: string) => void;

  // Admin: micro locations
  addMicroLocation: (loc: MicroLocation) => void;
  updateMicroLocation: (id: string, data: Partial<MicroLocation>) => void;
  deleteMicroLocation: (id: string) => void;

  // Client: profile
  updateClientProfile: (id: string, data: Partial<ClientProfile>) => void;

  // Client: media
  addMedia: (clientId: string, items: MediaItem[]) => void;
  removeMedia: (clientId: string, mediaId: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// --- localStorage helpers ---
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<ClientProfile[]>(() =>
    loadFromStorage<ClientProfile[]>('furni_clients', CLIENT_PROFILES).map((c) => {
      const photoLimit = c.photoLimit ?? 3;
      const videoLimit = c.videoLimit ?? 1;
      return { ...c, photoLimit, videoLimit, uploadLimit: photoLimit + videoLimit };
    })
  );
  const [locations, setLocations] = useState<Location[]>(() => loadFromStorage('furni_locations', LOCATIONS));
  const [divisions, setDivisions] = useState<Division[]>(() => loadFromStorage('furni_divisions', DIVISIONS));
  const [roads, setRoads] = useState<Road[]>(() => loadFromStorage('furni_roads', ROADS));
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => loadFromStorage('furni_blog', BLOG_POSTS));
  const [searchLocation, setSearchLocation] = useState('');
  const [shuffleIntervalMinutes, setShuffleIntervalMinutes] = useState<number>(() => loadFromStorage('furni_shuffle', 60));
  const [clientsPerPage, setClientsPerPageState] = useState<number>(() => loadFromStorage('furni_perpage', 20));
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => loadFromStorage('furni_settings', DEFAULT_SITE_SETTINGS));

  // Persist to localStorage whenever state changes
  useEffect(() => { saveToStorage('furni_clients', clients); }, [clients]);
  useEffect(() => { saveToStorage('furni_locations', locations); }, [locations]);
  useEffect(() => { saveToStorage('furni_divisions', divisions); }, [divisions]);
  useEffect(() => { saveToStorage('furni_roads', roads); }, [roads]);
  useEffect(() => { saveToStorage('furni_blog', blogPosts); }, [blogPosts]);
  useEffect(() => { saveToStorage('furni_shuffle', shuffleIntervalMinutes); }, [shuffleIntervalMinutes]);
  useEffect(() => { saveToStorage('furni_perpage', clientsPerPage); }, [clientsPerPage]);
  useEffect(() => { saveToStorage('furni_settings', siteSettings); }, [siteSettings]);

  // --- Supabase sync: hydrate from the database (source of truth) on first load ---
  const dbReady = React.useRef(false);
  const lastSynced = React.useRef<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [dbSellers, dbSettings, dbPrefs] = await Promise.all([
        dbService.fetchSellers(),
        dbService.fetchSiteSettings(),
        dbService.fetchSetting<{ shuffle?: number; perPage?: number }>('display_prefs'),
      ]);
      if (cancelled) return;
      dbReady.current = true;
      if (dbSellers && dbSellers.length > 0) {
        dbSellers.forEach((s) => { lastSynced.current[s.id] = JSON.stringify(s); });
        setClients(dbSellers);
      } else if (dbSellers && dbSellers.length === 0) {
        // Empty database: seed it once from the current (local/default) sellers
        setClients((prev) => [...prev]);
      }
      if (dbSettings && Object.keys(dbSettings).length > 0) {
        setSiteSettings((prev) => ({ ...prev, ...dbSettings }));
      }
      if (dbPrefs?.shuffle) setShuffleIntervalMinutes(dbPrefs.shuffle);
      if (dbPrefs?.perPage) setClientsPerPageState(dbPrefs.perPage);
      dbReady.current = true;
    })();
    return () => { cancelled = true; };
  }, []);

  // Write-through: push changed sellers (and subscriptions) to Supabase
  useEffect(() => {
    if (!dbReady.current) return;
    const currentIds = new Set(clients.map((c) => c.id));
    clients.forEach((c) => {
      const snapshot = JSON.stringify(c);
      if (lastSynced.current[c.id] === snapshot) return;
      const prevRaw = lastSynced.current[c.id];
      lastSynced.current[c.id] = snapshot;
      dbService.upsertSeller(c);
      const prevPkg = prevRaw ? (JSON.parse(prevRaw) as ClientProfile).visibilityPackage : undefined;
      if (c.visibilityPackage && JSON.stringify(prevPkg) !== JSON.stringify(c.visibilityPackage)) {
        dbService.upsertSubscription(c);
      }
    });
    Object.keys(lastSynced.current).forEach((id) => {
      if (!currentIds.has(id)) {
        delete lastSynced.current[id];
        dbService.deleteSeller(id);
      }
    });
  }, [clients]);

  useEffect(() => {
    if (!dbReady.current) return;
    dbService.saveSiteSettings(siteSettings);
  }, [siteSettings]);

  useEffect(() => {
    if (!dbReady.current) return;
    dbService.saveSetting('display_prefs', { shuffle: shuffleIntervalMinutes, perPage: clientsPerPage });
  }, [shuffleIntervalMinutes, clientsPerPage]);

  // --- Admin: clients ---
  const togglePin = useCallback((id: string) => {
    setClients((prev) => {
      const client = prev.find((c) => c.id === id);
      if (!client) return prev;
      const currentlyFeatured = prev.filter((c) => c.featured && c.status === 'active');
      const nextOrder = currentlyFeatured.length + 1;
      return prev.map((c) =>
        c.id === id
          ? { ...c, featured: !c.featured, featuredOrder: !c.featured ? nextOrder : null }
          : c
      );
    });
  }, []);

  const toggleStatus = useCallback((id: string, status: ProfileStatus) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }, []);

  const toggleHidden = useCallback((id: string) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, hidden: !c.hidden } : c)));
  }, []);

  const deleteClient = useCallback((id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const setUploadLimit = useCallback((id: string, limit: number) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, uploadLimit: limit } : c)));
  }, []);

  // Set photo/video limits for one seller, or for every seller (id === 'all')
  const setMediaLimits = useCallback((id: string | 'all', photos: number, videos: number) => {
    setClients((prev) =>
      prev.map((c) =>
        id === 'all' || c.id === id
          ? { ...c, photoLimit: photos, videoLimit: videos, uploadLimit: photos + videos }
          : c
      )
    );
    if (id === 'all') {
      setSiteSettings((prev) => ({ ...prev, defaultPhotoLimit: photos, defaultVideoLimit: videos }));
    }
  }, []);

  const addClient = useCallback((client: ClientProfile) => {
    setClients((prev) => [...prev, client]);
  }, []);

  const toggleVerified = useCallback((id: string) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, verified: !c.verified } : c)));
  }, []);

  const setClientTier = useCallback((id: string, tier: ListingTier) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, tier } : c)));
  }, []);

  const updateClientPassword = useCallback((id: string, newPassword: string) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, password: newPassword } : c)));
  }, []);

  const adminUpdateClient = useCallback((id: string, data: Partial<ClientProfile>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  }, []);

  const setSellerVisibilityPackage = useCallback((id: string, pkg: VisibilityPackageConfig) => {
    setClients((prev) => prev.map((c) =>
      c.id === id
        ? {
            ...c,
            visibilityPackage: pkg,
            tier: pkg.tier,
            subscriptionExpiry: pkg.endDate,
            status: 'active',
            // Track when free trial is first activated (only set once)
            freeTrialActivatedAt: c.freeTrialActivatedAt ?? new Date().toISOString(),
            freeTrialEnded: false,
          }
        : c
    ));
  }, []);

  const endSellerFreeTrial = useCallback((id: string) => {
    setClients((prev) => prev.map((c) => {
      if (c.id !== id) return c;
      // Expire the package to yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const expiredDate = yesterday.toISOString().split('T')[0];
      const tier = (c.visibilityPackage?.tier ?? c.tier ?? 'standard') as VisibilityPackageTier;
      const updatedPkg: VisibilityPackageConfig = {
        tier,
        startDate: c.visibilityPackage?.startDate ?? expiredDate,
        endDate: expiredDate,
        durationDays: c.visibilityPackage?.durationDays ?? 30,
        setByAdmin: true,
      };
      return {
        ...c,
        visibilityPackage: updatedPkg,
        subscriptionExpiry: expiredDate,
        status: 'dormant',
        freeTrialEnded: true,
      };
    }));
  }, []);

  const moveFeaturedUp = useCallback((id: string) => {
    setClients((prev) => {
      const featured = prev
        .filter((c) => c.featured && c.status === 'active')
        .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
      const idx = featured.findIndex((c) => c.id === id);
      if (idx <= 0) return prev;
      const reordered = [...featured];
      [reordered[idx - 1], reordered[idx]] = [reordered[idx], reordered[idx - 1]];
      return prev.map((c) => {
        const newPos = reordered.findIndex((r) => r.id === c.id);
        if (newPos !== -1) return { ...c, featuredOrder: newPos + 1 };
        return c;
      });
    });
  }, []);

  const moveFeaturedDown = useCallback((id: string) => {
    setClients((prev) => {
      const featured = prev
        .filter((c) => c.featured && c.status === 'active')
        .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
      const idx = featured.findIndex((c) => c.id === id);
      if (idx >= featured.length - 1) return prev;
      const reordered = [...featured];
      [reordered[idx], reordered[idx + 1]] = [reordered[idx + 1], reordered[idx]];
      return prev.map((c) => {
        const newPos = reordered.findIndex((r) => r.id === c.id);
        if (newPos !== -1) return { ...c, featuredOrder: newPos + 1 };
        return c;
      });
    });
  }, []);

  // --- Admin: locations ---
  const addLocation = useCallback((loc: Location) => {
    setLocations((prev) => [...prev, loc]);
  }, []);

  const updateLocation = useCallback((id: string, name: string, area: string) => {
    setLocations((prev) =>
      prev.map((l) => (l.id === id ? { ...l, name: name.trim(), area: area.trim() } : l))
    );
  }, []);

  const deleteLocation = useCallback((id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
  }, []);

  // --- Admin: divisions ---
  const addDivision = useCallback((div: Division) => {
    setDivisions((prev) => [...prev, div]);
  }, []);

  const updateDivision = useCallback((id: string, name: string, subcounty: string, county: string) => {
    setDivisions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, name: name.trim(), subcounty: subcounty.trim(), county: county.trim() } : d))
    );
  }, []);

  const deleteDivision = useCallback((id: string) => {
    setDivisions((prev) => prev.filter((d) => d.id !== id));
  }, []);

  // --- Admin: roads ---
  const addRoad = useCallback((road: Road) => {
    setRoads((prev) => [...prev, road]);
  }, []);

  const updateRoad = useCallback((id: string, name: string, county: string) => {
    setRoads((prev) =>
      prev.map((r) => (r.id === id ? { ...r, name: name.trim(), county: county.trim() } : r))
    );
  }, []);

  const deleteRoad = useCallback((id: string) => {
    setRoads((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // --- Admin: blog ---
  const saveBlogPost = useCallback((post: BlogPost) => {
    setBlogPosts((prev) => {
      const exists = prev.find((p) => p.id === post.id);
      if (exists) return prev.map((p) => (p.id === post.id ? post : p));
      return [post, ...prev];
    });
  }, []);

  const toggleBlogPublish = useCallback((id: string) => {
    setBlogPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === 'published' ? 'draft' : 'published' } : p
      )
    );
  }, []);

  const deleteBlogPost = useCallback((id: string) => {
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // --- Admin: settings ---
  const setShuffleInterval = useCallback((minutes: number) => {
    setShuffleIntervalMinutes(minutes);
  }, []);

  const setClientsPerPage = useCallback((count: number) => {
    setClientsPerPageState(count);
  }, []);

  const updateSiteSettings = useCallback((settings: Partial<SiteSettings>) => {
    setSiteSettings((prev) => ({ ...prev, ...settings }));
  }, []);

  const setCompulsoryProductFields = useCallback((fields: string[]) => {
    setSiteSettings((prev) => ({ ...prev, compulsoryProductFields: fields }));
  }, []);

  // --- Admin: nearby places ---
  const addNearbyPlace = useCallback((place: NearbyPlace) => {
    setSiteSettings((prev) => ({
      ...prev,
      nearbyPlaces: [...(prev.nearbyPlaces ?? []), place],
    }));
  }, []);

  const updateNearbyPlace = useCallback((id: string, data: Partial<NearbyPlace>) => {
    setSiteSettings((prev) => ({
      ...prev,
      nearbyPlaces: (prev.nearbyPlaces ?? []).map((p) => (p.id === id ? { ...p, ...data } : p)),
    }));
  }, []);

  const deleteNearbyPlace = useCallback((id: string) => {
    setSiteSettings((prev) => ({
      ...prev,
      nearbyPlaces: (prev.nearbyPlaces ?? []).filter((p) => p.id !== id),
    }));
  }, []);

  // --- Admin: micro locations ---
  const addMicroLocation = useCallback((loc: MicroLocation) => {
    setSiteSettings((prev) => ({
      ...prev,
      microLocations: [...(prev.microLocations ?? []), loc],
    }));
  }, []);

  const updateMicroLocation = useCallback((id: string, data: Partial<MicroLocation>) => {
    setSiteSettings((prev) => ({
      ...prev,
      microLocations: (prev.microLocations ?? []).map((l) => (l.id === id ? { ...l, ...data } : l)),
    }));
  }, []);

  const deleteMicroLocation = useCallback((id: string) => {
    setSiteSettings((prev) => ({
      ...prev,
      microLocations: (prev.microLocations ?? []).filter((l) => l.id !== id),
    }));
  }, []);

  // --- Client: profile ---
  const updateClientProfile = useCallback((id: string, data: Partial<ClientProfile>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  }, []);

  // --- Client: media ---
  const addMedia = useCallback((clientId: string, items: MediaItem[]) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId ? { ...c, media: [...c.media, ...items] } : c
      )
    );
  }, []);

  const removeMedia = useCallback((clientId: string, mediaId: string) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? { ...c, media: c.media.filter((m) => m.id !== mediaId) }
          : c
      )
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        clients,
        locations,
        divisions,
        roads,
        blogPosts,
        searchLocation,
        shuffleIntervalMinutes,
        clientsPerPage,
        siteSettings,
        setSearchLocation,
        togglePin,
        toggleStatus,
        toggleHidden,
        deleteClient,
        setUploadLimit,
        setMediaLimits,
        addClient,
        toggleVerified,
        setClientTier,
        updateClientPassword,
        adminUpdateClient,
        setSellerVisibilityPackage,
        endSellerFreeTrial,
        moveFeaturedUp,
        moveFeaturedDown,
        addLocation,
        updateLocation,
        deleteLocation,
        addDivision,
        updateDivision,
        deleteDivision,
        addRoad,
        updateRoad,
        deleteRoad,
        saveBlogPost,
        toggleBlogPublish,
        deleteBlogPost,
        setShuffleInterval,
        setClientsPerPage,
        updateSiteSettings,
        setCompulsoryProductFields,
        addNearbyPlace,
        updateNearbyPlace,
        deleteNearbyPlace,
        addMicroLocation,
        updateMicroLocation,
        deleteMicroLocation,
        updateClientProfile,
        addMedia,
        removeMedia,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used inside AppProvider');
  return ctx;
}
