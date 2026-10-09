'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, MapPin, Phone, Mail, User, FileText, CheckCircle, Package } from 'lucide-react';
import { ClientProfile } from '@/lib/mockData';
import { useAppStore } from '@/lib/AppContext';
import { Toaster, toast } from 'sonner';

interface Props {
  profile: ClientProfile;
}

interface ProfileFormData {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  subcounty: string;
  division: string;
  location: string;
  description: string;
  // Product detail fields
  itemType: string;
  weight: string;
  dimensions: string;
  material: string;
  colour: string;
  style: string;
  roomPlacement: string;
  furnitureType: string;
  condition: string;
  warranty: string;
  origin: string;
  delivery: string;
  assembly: string;
  paymentMethods: string;
}

const CATEGORY_OPTIONS = ['Sofas', 'Bedroom', 'Dining Sets', 'Office', "Children\'s", 'Outdoor', 'Custom Orders', 'Budget-Friendly', 'Luxury', 'Rattan', 'Traditional', 'Bespoke', 'Upholstery', 'Wholesale'];

const PRODUCT_DETAIL_FIELDS: { name: keyof ProfileFormData; label: string; placeholder: string; hint?: string }[] = [
  { name: 'itemType', label: 'Item Type', placeholder: 'e.g. Sofa Set, Dining Table, Wardrobe' },
  { name: 'weight', label: 'Weight', placeholder: 'e.g. 45 kg / 99 lbs (set)' },
  { name: 'dimensions', label: 'Dimensions', placeholder: 'e.g. 210 cm (L) x 90 cm (W) x 85 cm (H)' },
  { name: 'material', label: 'Material', placeholder: 'e.g. Solid wood frame, high-density foam' },
  { name: 'colour', label: 'Colour', placeholder: 'e.g. Beige (fabric), Dark Walnut' },
  { name: 'style', label: 'Style', placeholder: 'e.g. Modern / Contemporary, Traditional' },
  { name: 'roomPlacement', label: 'Room Placement', placeholder: 'e.g. Living Room, Bedroom, Office' },
  { name: 'furnitureType', label: 'Type', placeholder: 'e.g. Sofa Set (3-seater + 2 single chairs)' },
  { name: 'condition', label: 'Condition', placeholder: 'e.g. Brand New, Refurbished, Used' },
  { name: 'warranty', label: 'Warranty', placeholder: 'e.g. 1 Year (manufacturer)' },
  { name: 'origin', label: 'Origin', placeholder: 'e.g. Kenya, Turkey, Malaysia' },
  { name: 'delivery', label: 'Delivery', placeholder: 'e.g. Available within Nairobi and surrounding areas' },
  { name: 'assembly', label: 'Assembly', placeholder: 'e.g. Required (comes with instructions)' },
  { name: 'paymentMethods', label: 'Payment Methods', placeholder: 'e.g. Cash, M-Pesa, Bank Transfer' },
];

export default function ProfileEditor({ profile }: Props) {
  const { locations, divisions, updateClientProfile } = useAppStore();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(profile.categories);

  const { register, handleSubmit, watch, formState: { errors, isDirty } } = useForm<ProfileFormData>({
    defaultValues: {
      name: profile.name,
      businessName: profile.businessName,
      email: profile.email,
      phone: profile.phone,
      subcounty: profile.subcounty || '',
      division: profile.division || '',
      location: profile.location,
      description: profile.description,
      itemType: profile.itemType || '',
      weight: profile.weight || '',
      dimensions: profile.dimensions || '',
      material: profile.material || '',
      colour: profile.colour || '',
      style: profile.style || '',
      roomPlacement: profile.roomPlacement || '',
      furnitureType: profile.furnitureType || '',
      condition: profile.condition || '',
      warranty: profile.warranty || '',
      origin: profile.origin || '',
      delivery: profile.delivery || '',
      assembly: profile.assembly || '',
      paymentMethods: profile.paymentMethods || '',
    },
  });

  const selectedSubcounty = watch('subcounty');
  const filteredDivisions = selectedSubcounty
    ? divisions.filter((d) => d.subcounty.toLowerCase() === selectedSubcounty.toLowerCase())
    : divisions;

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const onSubmit = (data: ProfileFormData) => {
    setSaving(true);
    setTimeout(() => {
      updateClientProfile(profile.id, { ...data, categories: selectedCategories });
      setSaving(false);
      setSaved(true);
      toast.success('Profile updated successfully', {
        description: 'Your listing is now live with the new details.',
      });
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  return (
    <div className="max-w-3xl">
      <Toaster position="bottom-right" richColors />
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Edit Profile</h2>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Changes are reflected on your public listing immediately after saving.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Personal Info */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>
              <User size={15} />
            </div>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Personal Information</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Your Name <span style={{ color: '#DC2626' }}>*</span></label>
              <input type="text" {...register('name', { required: 'Name is required' })} className="input-base w-full px-3 py-2.5 text-sm" placeholder="James Mwangi" />
              {errors.name && <p className="text-xs mt-1.5" style={{ color: '#DC2626' }}>{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Business Name <span style={{ color: '#DC2626' }}>*</span></label>
              <input type="text" {...register('businessName', { required: 'Business name is required' })} className="input-base w-full px-3 py-2.5 text-sm" placeholder="Mwangi Furniture Works" />
              {errors.businessName && <p className="text-xs mt-1.5" style={{ color: '#DC2626' }}>{errors.businessName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Email Address <span style={{ color: '#DC2626' }}>*</span></label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                <input type="email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} className="input-base w-full pl-9 pr-4 py-2.5 text-sm" placeholder="you@business.co.ke" />
              </div>
              {errors.email && <p className="text-xs mt-1.5" style={{ color: '#DC2626' }}>{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Phone Number <span style={{ color: '#DC2626' }}>*</span></label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                <input type="tel" {...register('phone', { required: 'Phone number is required' })} className="input-base w-full pl-9 pr-4 py-2.5 text-sm" placeholder="+254 700 000 000" />
              </div>
              {errors.phone && <p className="text-xs mt-1.5" style={{ color: '#DC2626' }}>{errors.phone.message}</p>}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>
              <MapPin size={15} />
            </div>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Business Location</h3>
          </div>

          <div className="mb-4 px-3 py-2.5 rounded-lg text-xs" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
            <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Your URL: </span>
            <code className="font-mono" style={{ color: 'var(--primary)' }}>/county/business-name/subcounty/division/area/id</code>
            <span className="ml-2">e.g. <code className="font-mono">/kiambu/mwangi-furniture/kiambu/kikuyu/kinoo/1</code></span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Sub-County <span style={{ color: '#DC2626' }}>*</span></label>
              <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>e.g. Kiambu, Westlands</p>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                <input
                  type="text"
                  {...register('subcounty', { required: 'Sub-county is required' })}
                  className="input-base w-full pl-9 pr-4 py-2.5 text-sm"
                  placeholder="e.g. Kiambu"
                />
              </div>
              {errors.subcounty && <p className="text-xs mt-1.5" style={{ color: '#DC2626' }}>{errors.subcounty.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Division <span style={{ color: '#DC2626' }}>*</span></label>
              <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>e.g. Kikuyu, Limuru</p>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                <select {...register('division', { required: 'Division is required' })} className="input-base w-full pl-9 pr-4 py-2.5 text-sm appearance-none cursor-pointer">
                  <option value="">Select division…</option>
                  {filteredDivisions.map((div) => (
                    <option key={`editor-div-${div.id}`} value={div.name}>{div.name} — {div.subcounty}</option>
                  ))}
                  {filteredDivisions.length === 0 && divisions.map((div) => (
                    <option key={`editor-div-all-${div.id}`} value={div.name}>{div.name} — {div.subcounty}</option>
                  ))}
                </select>
              </div>
              {errors.division && <p className="text-xs mt-1.5" style={{ color: '#DC2626' }}>{errors.division.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Area <span style={{ color: '#DC2626' }}>*</span></label>
              <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>e.g. Kinoo, Kikuyu Town</p>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                <select {...register('location', { required: 'Area is required' })} className="input-base w-full pl-9 pr-4 py-2.5 text-sm appearance-none cursor-pointer">
                  {locations.map((loc) => (
                    <option key={`editor-loc-${loc.id}`} value={loc.name}>{loc.name} — {loc.area}</option>
                  ))}
                </select>
              </div>
              {errors.location && <p className="text-xs mt-1.5" style={{ color: '#DC2626' }}>{errors.location.message}</p>}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>
              <FileText size={15} />
            </div>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Business Description</h3>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Description <span style={{ color: '#DC2626' }}>*</span></label>
            <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>Describe what you sell, your specialities, delivery options, and what makes your business unique. Aim for 80–200 words.</p>
            <textarea
              {...register('description', { required: 'Description is required', minLength: { value: 40, message: 'Please write at least 40 characters' } })}
              rows={5}
              className="input-base w-full px-3 py-2.5 text-sm resize-none"
              placeholder="Describe your furniture business…"
            />
            {errors.description && <p className="text-xs mt-1.5" style={{ color: '#DC2626' }}>{errors.description.message}</p>}
          </div>
        </div>

        {/* Product Details */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(220,38,38,0.1)', color: '#DC2626' }}>
              <Package size={15} />
            </div>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Product Details</h3>
          </div>
          <p className="text-xs mb-5" style={{ color: 'var(--muted-foreground)' }}>
            Fill in the product specifications that will appear on your public profile. Leave blank any fields that don&apos;t apply.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PRODUCT_DETAIL_FIELDS.map((field) => (
              <div key={`prod-field-${field.name}`}>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#DC2626' }}>{field.label}</label>
                <input
                  type="text"
                  {...register(field.name)}
                  className="input-base w-full px-3 py-2.5 text-sm"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Furniture Categories</h3>
          </div>
          <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>Select all categories that describe what you sell. These appear as tags on your listing.</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={`cat-toggle-${cat}`}
                type="button"
                onClick={() => toggleCategory(cat)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  backgroundColor: selectedCategories.includes(cat) ? 'var(--primary)' : 'var(--muted)',
                  color: selectedCategories.includes(cat) ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          {selectedCategories.length === 0 && (
            <p className="text-xs mt-2" style={{ color: '#DC2626' }}>Please select at least one category</p>
          )}
        </div>

        {/* Sticky save bar */}
        <div className="sticky bottom-0 -mx-6 xl:-mx-8 px-6 xl:px-8 py-4 border-t flex items-center justify-between gap-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          {isDirty && !saved && (
            <p className="text-xs font-medium" style={{ color: '#D97706' }}>● Unsaved changes</p>
          )}
          {saved && (
            <p className="text-xs font-medium flex items-center gap-1.5" style={{ color: '#16A34A' }}>
              <CheckCircle size={13} /> Saved successfully
            </p>
          )}
          {!isDirty && !saved && <span />}
          <button
            type="submit"
            disabled={saving || selectedCategories.length === 0}
            className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2 disabled:opacity-60 ml-auto"
          >
            {saving ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
            ) : (
              <Save size={15} />
            )}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}