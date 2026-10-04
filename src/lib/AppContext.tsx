'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
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
} from '@/lib/mockData';

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
  moveFeaturedUp: (id: string) => void;
  moveFeaturedDown: (id: string) => void;
  addClient: (client: ClientProfile) => void;
  toggleVerified: (id: string) => void;
  setClientTier: (id: string, tier: ListingTier) => void;
  updateClientPassword: (id: string, newPassword: string) => void;
  adminUpdateClient: (id: string, data: Partial<ClientProfile>) => void;
  setSellerVisibilityPackage: (id: string, pkg: VisibilityPackageConfig) => void;

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
  const [clients, setClients] = useState<ClientProfile[]>(() => loadFromStorage('furni_clients', CLIENT_PROFILES));
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
        ? { ...c, visibilityPackage: pkg, tier: pkg.tier, subscriptionExpiry: pkg.endDate, status: 'active' }
        : c
    ));
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
        addClient,
        toggleVerified,
        setClientTier,
        updateClientPassword,
        adminUpdateClient,
        setSellerVisibilityPackage,
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
