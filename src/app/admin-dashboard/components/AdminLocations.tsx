'use client';
import React, { useState } from 'react';
import { Plus, Trash2, Edit2, MapPin, Check, X, AlertCircle, Route, Layers } from 'lucide-react';
import { Location, Division, Road } from '@/lib/mockData';
import { useAppStore } from '@/lib/AppContext';
import { Toaster, toast } from 'sonner';

type ActiveTab = 'areas' | 'divisions' | 'roads';

export default function AdminLocations() {
  const {
    locations, addLocation, updateLocation, deleteLocation,
    divisions, addDivision, updateDivision, deleteDivision,
    roads, addRoad, updateRoad, deleteRoad,
  } = useAppStore();
  const [activeTab, setActiveTab] = useState<ActiveTab>('divisions');

  // Area (sub-location) state
  const [editingLocId, setEditingLocId] = useState<string | null>(null);
  const [editLocName, setEditLocName] = useState('');
  const [editLocArea, setEditLocArea] = useState('');
  const [showAddLoc, setShowAddLoc] = useState(false);
  const [newLocName, setNewLocName] = useState('');
  const [newLocArea, setNewLocArea] = useState('');
  const [deleteLocTarget, setDeleteLocTarget] = useState<string | null>(null);

  // Division state
  const [editingDivId, setEditingDivId] = useState<string | null>(null);
  const [editDivName, setEditDivName] = useState('');
  const [editDivSubcounty, setEditDivSubcounty] = useState('');
  const [editDivCounty, setEditDivCounty] = useState('');
  const [showAddDiv, setShowAddDiv] = useState(false);
  const [newDivName, setNewDivName] = useState('');
  const [newDivSubcounty, setNewDivSubcounty] = useState('');
  const [newDivCounty, setNewDivCounty] = useState('');
  const [deleteDivTarget, setDeleteDivTarget] = useState<string | null>(null);

  // Road state
  const [editingRoadId, setEditingRoadId] = useState<string | null>(null);
  const [editRoadName, setEditRoadName] = useState('');
  const [editRoadCounty, setEditRoadCounty] = useState('');
  const [showAddRoad, setShowAddRoad] = useState(false);
  const [newRoadName, setNewRoadName] = useState('');
  const [newRoadCounty, setNewRoadCounty] = useState('');
  const [deleteRoadTarget, setDeleteRoadTarget] = useState<string | null>(null);

  // Area handlers
  const startEditLoc = (loc: Location) => { setEditingLocId(loc.id); setEditLocName(loc.name); setEditLocArea(loc.area); };
  const saveEditLoc = (id: string) => {
    if (!editLocName.trim()) return;
    updateLocation(id, editLocName, editLocArea);
    toast.success('Area updated');
    setEditingLocId(null);
  };
  const handleAddLocation = () => {
    if (!newLocName.trim() || !newLocArea.trim()) return;
    const loc: Location = { id: `loc-${newLocName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`, name: newLocName.trim(), area: newLocArea.trim(), profileCount: 0 };
    addLocation(loc);
    toast.success(`${loc.name} added`);
    setNewLocName(''); setNewLocArea(''); setShowAddLoc(false);
  };

  // Division handlers
  const startEditDiv = (div: Division) => { setEditingDivId(div.id); setEditDivName(div.name); setEditDivSubcounty(div.subcounty); setEditDivCounty(div.county); };
  const saveEditDiv = (id: string) => {
    if (!editDivName.trim()) return;
    updateDivision(id, editDivName, editDivSubcounty, editDivCounty);
    toast.success('Division updated');
    setEditingDivId(null);
  };
  const handleAddDivision = () => {
    if (!newDivName.trim() || !newDivSubcounty.trim() || !newDivCounty.trim()) return;
    const div: Division = { id: `div-${newDivName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`, name: newDivName.trim(), subcounty: newDivSubcounty.trim(), county: newDivCounty.trim() };
    addDivision(div);
    toast.success(`${div.name} division added`);
    setNewDivName(''); setNewDivSubcounty(''); setNewDivCounty(''); setShowAddDiv(false);
  };

  // Road handlers
  const startEditRoad = (road: Road) => { setEditingRoadId(road.id); setEditRoadName(road.name); setEditRoadCounty(road.county); };
  const saveEditRoad = (id: string) => {
    if (!editRoadName.trim()) return;
    updateRoad(id, editRoadName, editRoadCounty);
    toast.success('Road/Corridor updated');
    setEditingRoadId(null);
  };
  const handleAddRoad = () => {
    if (!newRoadName.trim() || !newRoadCounty.trim()) return;
    const road: Road = { id: `road-${newRoadName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`, name: newRoadName.trim(), county: newRoadCounty.trim() };
    addRoad(road);
    toast.success(`${road.name} added`);
    setNewRoadName(''); setNewRoadCounty(''); setShowAddRoad(false);
  };

  return (
    <div className="max-w-2xl">
      <Toaster position="bottom-right" richColors />

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Manage Locations</h2>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Manage the 4-level location hierarchy used in seller profiles and URLs.
        </p>
      </div>

      {/* URL structure hint */}
      <div className="mb-5 px-3 py-2.5 rounded-lg text-xs" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
        <span className="font-semibold" style={{ color: 'var(--foreground)' }}>URL Structure: </span>
        <code className="font-mono" style={{ color: 'var(--primary)' }}>/county/business-name/subcounty/division/area/id</code>
        <span className="ml-2">e.g. <code className="font-mono">/kiambu/mwangi-furniture/kiambu/kikuyu/kinoo/1</code></span>
        <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(194,105,42,0.12)', color: 'var(--primary)' }}>County</span>
          <span style={{ color: 'var(--muted-foreground)' }}>→</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(194,105,42,0.12)', color: 'var(--primary)' }}>Sub-county</span>
          <span style={{ color: 'var(--muted-foreground)' }}>→</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(194,105,42,0.12)', color: 'var(--primary)' }}>Division</span>
          <span style={{ color: 'var(--muted-foreground)' }}>→</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(194,105,42,0.12)', color: 'var(--primary)' }}>Area</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
        <button
          onClick={() => setActiveTab('divisions')}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all"
          style={activeTab === 'divisions' ? { backgroundColor: 'var(--card)', color: 'var(--primary)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { color: 'var(--muted-foreground)' }}
        >
          <Layers size={14} /> Divisions
        </button>
        <button
          onClick={() => setActiveTab('areas')}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all"
          style={activeTab === 'areas' ? { backgroundColor: 'var(--card)', color: 'var(--primary)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { color: 'var(--muted-foreground)' }}
        >
          <MapPin size={14} /> Areas
        </button>
        <button
          onClick={() => setActiveTab('roads')}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all"
          style={activeTab === 'roads' ? { backgroundColor: 'var(--card)', color: 'var(--primary)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { color: 'var(--muted-foreground)' }}
        >
          <Route size={14} /> Roads
        </button>
      </div>

      {/* Divisions tab */}
      {activeTab === 'divisions' && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{divisions.length} divisions</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>e.g. Kikuyu division within Kiambu sub-county</p>
            </div>
            <button onClick={() => setShowAddDiv(true)} className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
              <Plus size={15} /> Add Division
            </button>
          </div>

          {showAddDiv && (
            <div className="rounded-xl border p-5 mb-5" style={{ backgroundColor: 'rgba(194,105,42,0.05)', borderColor: 'rgba(194,105,42,0.3)' }}>
              <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--foreground)' }}>Add New Division</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Division Name</label>
                  <input type="text" value={newDivName} onChange={(e) => setNewDivName(e.target.value)} className="input-base w-full px-3 py-2 text-sm" placeholder="e.g. Kikuyu" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Sub-county</label>
                  <input type="text" value={newDivSubcounty} onChange={(e) => setNewDivSubcounty(e.target.value)} className="input-base w-full px-3 py-2 text-sm" placeholder="e.g. Kiambu" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>County</label>
                  <input type="text" value={newDivCounty} onChange={(e) => setNewDivCounty(e.target.value)} className="input-base w-full px-3 py-2 text-sm" placeholder="e.g. Kiambu" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleAddDivision} className="btn-primary px-4 py-2 text-sm flex items-center gap-1.5"><Check size={14} /> Save Division</button>
                <button onClick={() => setShowAddDiv(false)} className="btn-secondary px-4 py-2 text-sm">Cancel</button>
              </div>
            </div>
          )}

          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="px-4 py-3 border-b text-xs font-semibold uppercase tracking-wider grid grid-cols-12 gap-3" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
              <span className="col-span-4">Division</span>
              <span className="col-span-3">Sub-county</span>
              <span className="col-span-2">County</span>
              <span className="col-span-3 text-right">Actions</span>
            </div>
            {divisions.map((div, i) => (
              <div key={`div-row-${div.id}`} className="border-t px-4 py-3.5 grid grid-cols-12 gap-3 items-center transition-colors hover:bg-muted/40" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 1 ? 'rgba(237,232,225,0.25)' : 'var(--card)' }}>
                {editingDivId === div.id ? (
                  <>
                    <div className="col-span-4"><input type="text" value={editDivName} onChange={(e) => setEditDivName(e.target.value)} className="input-base w-full px-2 py-1.5 text-sm" autoFocus /></div>
                    <div className="col-span-3"><input type="text" value={editDivSubcounty} onChange={(e) => setEditDivSubcounty(e.target.value)} className="input-base w-full px-2 py-1.5 text-sm" /></div>
                    <div className="col-span-2"><input type="text" value={editDivCounty} onChange={(e) => setEditDivCounty(e.target.value)} className="input-base w-full px-2 py-1.5 text-sm" /></div>
                    <div className="col-span-3 flex items-center justify-end gap-2">
                      <button onClick={() => saveEditDiv(div.id)} className="p-1.5 rounded-lg" style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}><Check size={14} /></button>
                      <button onClick={() => setEditingDivId(null)} className="p-1.5 rounded-lg" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}><X size={14} /></button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-span-4 flex items-center gap-2">
                      <Layers size={14} style={{ color: 'var(--primary)' }} className="flex-shrink-0" />
                      <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{div.name}</span>
                    </div>
                    <div className="col-span-3"><span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{div.subcounty}</span></div>
                    <div className="col-span-2"><span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{div.county}</span></div>
                    <div className="col-span-3 flex items-center justify-end gap-2">
                      <button onClick={() => startEditDiv(div)} className="p-1.5 rounded-lg" style={{ color: 'var(--muted-foreground)', backgroundColor: 'var(--muted)' }}><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteDivTarget(div.id)} className="p-1.5 rounded-lg" style={{ color: '#DC2626', backgroundColor: '#FEE2E2' }}><Trash2 size={14} /></button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Areas tab */}
      {activeTab === 'areas' && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{locations.length} areas</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>e.g. Kinoo area within Kikuyu division</p>
            </div>
            <button onClick={() => setShowAddLoc(true)} className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
              <Plus size={15} /> Add Area
            </button>
          </div>

          {showAddLoc && (
            <div className="rounded-xl border p-5 mb-5" style={{ backgroundColor: 'rgba(194,105,42,0.05)', borderColor: 'rgba(194,105,42,0.3)' }}>
              <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--foreground)' }}>Add New Area</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Area Name</label>
                  <input type="text" value={newLocName} onChange={(e) => setNewLocName(e.target.value)} className="input-base w-full px-3 py-2 text-sm" placeholder="e.g. Kinoo" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Division / Region</label>
                  <input type="text" value={newLocArea} onChange={(e) => setNewLocArea(e.target.value)} className="input-base w-full px-3 py-2 text-sm" placeholder="e.g. Kikuyu" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleAddLocation} className="btn-primary px-4 py-2 text-sm flex items-center gap-1.5"><Check size={14} /> Save Area</button>
                <button onClick={() => setShowAddLoc(false)} className="btn-secondary px-4 py-2 text-sm">Cancel</button>
              </div>
            </div>
          )}

          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="px-4 py-3 border-b text-xs font-semibold uppercase tracking-wider grid grid-cols-12 gap-3" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
              <span className="col-span-4">Area Name</span>
              <span className="col-span-4">Division</span>
              <span className="col-span-1">Listings</span>
              <span className="col-span-3 text-right">Actions</span>
            </div>
            {locations.map((loc, i) => (
              <div key={`loc-row-${loc.id}`} className="border-t px-4 py-3.5 grid grid-cols-12 gap-3 items-center transition-colors hover:bg-muted/40" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 1 ? 'rgba(237,232,225,0.25)' : 'var(--card)' }}>
                {editingLocId === loc.id ? (
                  <>
                    <div className="col-span-4"><input type="text" value={editLocName} onChange={(e) => setEditLocName(e.target.value)} className="input-base w-full px-2 py-1.5 text-sm" autoFocus /></div>
                    <div className="col-span-4"><input type="text" value={editLocArea} onChange={(e) => setEditLocArea(e.target.value)} className="input-base w-full px-2 py-1.5 text-sm" /></div>
                    <div className="col-span-1"><span className="text-sm font-mono" style={{ color: 'var(--muted-foreground)' }}>{loc.profileCount}</span></div>
                    <div className="col-span-3 flex items-center justify-end gap-2">
                      <button onClick={() => saveEditLoc(loc.id)} className="p-1.5 rounded-lg" style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}><Check size={14} /></button>
                      <button onClick={() => setEditingLocId(null)} className="p-1.5 rounded-lg" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}><X size={14} /></button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-span-4 flex items-center gap-2">
                      <MapPin size={14} style={{ color: 'var(--primary)' }} className="flex-shrink-0" />
                      <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{loc.name}</span>
                    </div>
                    <div className="col-span-4"><span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{loc.area}</span></div>
                    <div className="col-span-1">
                      <span className="text-sm font-mono tabular-nums px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{loc.profileCount}</span>
                    </div>
                    <div className="col-span-3 flex items-center justify-end gap-2">
                      <button onClick={() => startEditLoc(loc)} className="p-1.5 rounded-lg" style={{ color: 'var(--muted-foreground)', backgroundColor: 'var(--muted)' }}><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteLocTarget(loc.id)} className="p-1.5 rounded-lg" style={{ color: '#DC2626', backgroundColor: '#FEE2E2' }}><Trash2 size={14} /></button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--muted-foreground)' }}>
            {locations.length} areas available. Removing one will require affected sellers to update their profile.
          </p>
        </>
      )}

      {/* Roads tab */}
      {activeTab === 'roads' && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{roads.length} roads/corridors</p>
            <button onClick={() => setShowAddRoad(true)} className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
              <Plus size={15} /> Add Road
            </button>
          </div>

          {showAddRoad && (
            <div className="rounded-xl border p-5 mb-5" style={{ backgroundColor: 'rgba(194,105,42,0.05)', borderColor: 'rgba(194,105,42,0.3)' }}>
              <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--foreground)' }}>Add New Road / Corridor</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Road Name</label>
                  <input type="text" value={newRoadName} onChange={(e) => setNewRoadName(e.target.value)} className="input-base w-full px-3 py-2 text-sm" placeholder="e.g. Waiyaki Way" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>County</label>
                  <input type="text" value={newRoadCounty} onChange={(e) => setNewRoadCounty(e.target.value)} className="input-base w-full px-3 py-2 text-sm" placeholder="e.g. Nairobi" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleAddRoad} className="btn-primary px-4 py-2 text-sm flex items-center gap-1.5"><Check size={14} /> Save Road</button>
                <button onClick={() => setShowAddRoad(false)} className="btn-secondary px-4 py-2 text-sm">Cancel</button>
              </div>
            </div>
          )}

          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="px-4 py-3 border-b text-xs font-semibold uppercase tracking-wider grid grid-cols-12 gap-3" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
              <span className="col-span-6">Road / Corridor</span>
              <span className="col-span-3">County</span>
              <span className="col-span-3 text-right">Actions</span>
            </div>
            {roads.map((road, i) => (
              <div key={`road-row-${road.id}`} className="border-t px-4 py-3.5 grid grid-cols-12 gap-3 items-center transition-colors hover:bg-muted/40" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 1 ? 'rgba(237,232,225,0.25)' : 'var(--card)' }}>
                {editingRoadId === road.id ? (
                  <>
                    <div className="col-span-6"><input type="text" value={editRoadName} onChange={(e) => setEditRoadName(e.target.value)} className="input-base w-full px-2 py-1.5 text-sm" autoFocus /></div>
                    <div className="col-span-3"><input type="text" value={editRoadCounty} onChange={(e) => setEditRoadCounty(e.target.value)} className="input-base w-full px-2 py-1.5 text-sm" /></div>
                    <div className="col-span-3 flex items-center justify-end gap-2">
                      <button onClick={() => saveEditRoad(road.id)} className="p-1.5 rounded-lg" style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}><Check size={14} /></button>
                      <button onClick={() => setEditingRoadId(null)} className="p-1.5 rounded-lg" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}><X size={14} /></button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-span-6 flex items-center gap-2">
                      <Route size={14} style={{ color: 'var(--primary)' }} className="flex-shrink-0" />
                      <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{road.name}</span>
                    </div>
                    <div className="col-span-3"><span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{road.county}</span></div>
                    <div className="col-span-3 flex items-center justify-end gap-2">
                      <button onClick={() => startEditRoad(road)} className="p-1.5 rounded-lg" style={{ color: 'var(--muted-foreground)', backgroundColor: 'var(--muted)' }}><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteRoadTarget(road.id)} className="p-1.5 rounded-lg" style={{ color: '#DC2626', backgroundColor: '#FEE2E2' }}><Trash2 size={14} /></button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete division confirm */}
      {deleteDivTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(28,20,16,0.6)' }}>
          <div className="rounded-2xl border p-6 max-w-sm w-full shadow-modal" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}><AlertCircle size={20} /></div>
              <div>
                <h3 className="font-bold text-base mb-1" style={{ color: 'var(--foreground)' }}>Remove this division?</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  <strong>{divisions.find((d) => d.id === deleteDivTarget)?.name}</strong> will be removed. Sellers using this division will need to update their profile.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { deleteDivision(deleteDivTarget); toast.success('Division removed'); setDeleteDivTarget(null); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#DC2626', color: '#fff' }}>Remove</button>
              <button onClick={() => setDeleteDivTarget(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete area confirm */}
      {deleteLocTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(28,20,16,0.6)' }}>
          <div className="rounded-2xl border p-6 max-w-sm w-full shadow-modal" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}><AlertCircle size={20} /></div>
              <div>
                <h3 className="font-bold text-base mb-1" style={{ color: 'var(--foreground)' }}>Remove this area?</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  <strong>{locations.find((l) => l.id === deleteLocTarget)?.name}</strong> will be removed. Sellers using this area will need to update their profile.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { deleteLocation(deleteLocTarget); toast.success('Area removed'); setDeleteLocTarget(null); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#DC2626', color: '#fff' }}>Remove</button>
              <button onClick={() => setDeleteLocTarget(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete road confirm */}
      {deleteRoadTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(28,20,16,0.6)' }}>
          <div className="rounded-2xl border p-6 max-w-sm w-full shadow-modal" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}><AlertCircle size={20} /></div>
              <div>
                <h3 className="font-bold text-base mb-1" style={{ color: 'var(--foreground)' }}>Remove this road?</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  <strong>{roads.find((r) => r.id === deleteRoadTarget)?.name}</strong> will be removed. Sellers using this road will need to update their profile.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { deleteRoad(deleteRoadTarget); toast.success('Road removed'); setDeleteRoadTarget(null); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#DC2626', color: '#fff' }}>Remove</button>
              <button onClick={() => setDeleteRoadTarget(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}