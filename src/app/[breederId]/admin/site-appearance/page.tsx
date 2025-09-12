'use client';

import { useState, useEffect, use, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/Label';
import { Upload, X } from 'lucide-react';
import { LayoutConfig, SectionType, HeaderSection, HeroSection, AboutSection, FooterSection } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { fetchUserSiteLayoutConfig } from '@/store/slices/userSiteSlice';
import api from '@/lib/api/axios';
import { imageUploadToCloudinary } from '@/lib/utils/fetchCloudinary';

export default function SiteAppearancePage({ params }: { params: Promise<{ breederId: string }> }) {
  const resolvedParams = use(params);
  const dispatch = useAppDispatch();

  // Get state from Redux store
  const {
    layoutConfig,
    headerConfig,
    heroConfig,
    petlistConfig,
    aboutConfig,
    footerConfig,
    loading,
    error,
    breederId
  } = useAppSelector((state) => state.userSite);

  // Local state for form data  
  const [formData, setFormData] = useState({
    header: {
      businessName: headerConfig?.businessName || '',
      logoUrl: headerConfig?.logoUrl || ''
    },
    hero: {
      title: heroConfig?.title || '',
      subtitle: heroConfig?.subtitle || '',
      imageUrls: heroConfig?.imageUrls || []
    },
    about: {
      title: aboutConfig?.title || '',
      content: aboutConfig?.content || ''
    },
    footer: {
      phone: footerConfig?.phone || '',
      email: footerConfig?.email || '',
      address: footerConfig?.address || ''
    }
  });

  // State for local file previews (không upload ngay)
  const [localFiles, setLocalFiles] = useState({
    logo: null as File | null,
    logoPreview: '' as string,
    heroImages: [] as { file: File; preview: string }[]
  });

  // Loading states
  const [saving, setSaving] = useState(false);

  // Ref để track blob URLs để cleanup
  const blobUrlsRef = useRef<string[]>([]);

  // Cleanup blob URLs khi component unmount
  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  // Update form data when Redux state changes
  useEffect(() => {
    setFormData({
      header: {
        businessName: headerConfig?.businessName || '',
        logoUrl: headerConfig?.logoUrl || ''
      },
      hero: {
        title: heroConfig?.title || '',
        subtitle: heroConfig?.subtitle || '',
        imageUrls: heroConfig?.imageUrls || []
      },
      about: {
        title: aboutConfig?.title || '',
        content: aboutConfig?.content || ''
      },
      footer: {
        phone: footerConfig?.phone || '',
        email: footerConfig?.email || '',
        address: footerConfig?.address || ''
      }
    });
  }, [headerConfig, heroConfig, aboutConfig, footerConfig]);

  // Handle logo file selection (không upload ngay)
  const handleLogoFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLocalFiles(prev => {
      // Cleanup logo preview cũ nếu có
      if (prev.logoPreview) {
        URL.revokeObjectURL(prev.logoPreview);
        // Remove từ blobUrlsRef
        const indexInRef = blobUrlsRef.current.indexOf(prev.logoPreview);
        if (indexInRef > -1) {
          blobUrlsRef.current.splice(indexInRef, 1);
        }
      }

      // Tạo preview URL từ file local
      const previewUrl = URL.createObjectURL(file);
      blobUrlsRef.current.push(previewUrl);

      return {
        ...prev,
        logo: file,
        logoPreview: previewUrl
      };
    });
  };

  // Handle hero image file selection (không upload ngay)
  const handleHeroImageFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Tạo preview URL từ file local
    const previewUrl = URL.createObjectURL(file);
    blobUrlsRef.current.push(previewUrl);

    setLocalFiles(prev => ({
      ...prev,
      heroImages: [...prev.heroImages, { file, preview: previewUrl }]
    }));
  };

  // Handle remove hero image
  const handleRemoveHeroImage = (index: number) => {
    setLocalFiles(prev => {
      // Cleanup blob URL của image bị remove
      const imageToRemove = prev.heroImages[index];
      if (imageToRemove?.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
        // Remove từ blobUrlsRef
        const indexInRef = blobUrlsRef.current.indexOf(imageToRemove.preview);
        if (indexInRef > -1) {
          blobUrlsRef.current.splice(indexInRef, 1);
        }
      }

      return {
        ...prev,
        heroImages: prev.heroImages.filter((_, i) => i !== index)
      };
    });
  };

  // Handle reset changes
  const handleResetChanges = () => {
    setFormData({
      header: {
        businessName: headerConfig?.businessName || '',
        logoUrl: headerConfig?.logoUrl || ''
      },
      hero: {
        title: heroConfig?.title || '',
        subtitle: heroConfig?.subtitle || '',
        imageUrls: heroConfig?.imageUrls || []
      },
      about: {
        title: aboutConfig?.title || '',
        content: aboutConfig?.content || ''
      },
      footer: {
        phone: footerConfig?.phone || '',
        email: footerConfig?.email || '',
        address: footerConfig?.address || ''
      }
    });

    setLocalFiles(prev => {
      // Cleanup tất cả blob URLs từ localFiles
      if (prev.logoPreview) {
        URL.revokeObjectURL(prev.logoPreview);
      }
      
      prev.heroImages.forEach(item => {
        if (item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });

      // Cleanup tất cả blob URLs từ ref
      blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      blobUrlsRef.current = [];

      return {
        logo: null,
        logoPreview: '',
        heroImages: []
      };
    });
  };

  // Handle input changes
  const handleChangeLayout = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  // Handle save changes (upload files khi save)
  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      let logoUrl = formData.header.logoUrl;
      let heroImageUrls = [...formData.hero.imageUrls];

      // Upload logo nếu có file mới
      if (localFiles.logo) {
        logoUrl = await imageUploadToCloudinary(localFiles.logo);
      }

      // Upload hero images nếu có files mới
      if (localFiles.heroImages.length > 0) {
        const uploadPromises = localFiles.heroImages.map(item => 
          imageUploadToCloudinary(item.file)
        );
        const uploadedUrls = await Promise.all(uploadPromises);
        heroImageUrls = [...heroImageUrls, ...uploadedUrls];
      }

      const layoutConfigData: LayoutConfig = {
        sections: [
          {
            type: SectionType.HEADER,
            logoUrl: logoUrl,
            businessName: formData.header.businessName,
          } as HeaderSection,
          {
            type: SectionType.HERO,
            title: formData.hero.title,
            subtitle: formData.hero.subtitle,
            imageUrls: heroImageUrls,
          } as HeroSection,
          {
            type: SectionType.ABOUT,
            title: formData.about.title,
            content: formData.about.content,
          } as AboutSection,
          {
            type: SectionType.FOOTER,
            phone: formData.footer.phone,
            email: formData.footer.email,
            address: formData.footer.address,
          } as FooterSection
        ]
      };

      const response = await api.put(`/user-site/${resolvedParams.breederId}/layout-config`, layoutConfigData);
      console.log('Save response:', response);

      // Refresh the layout config in Redux store
      dispatch(fetchUserSiteLayoutConfig(resolvedParams.breederId));

      // Cleanup local files trước khi reset
      setLocalFiles(prev => {
        // Cleanup logo preview nếu có
        if (prev.logoPreview) {
          URL.revokeObjectURL(prev.logoPreview);
        }

        // Cleanup hero images previews nếu có
        prev.heroImages.forEach(item => {
          if (item.preview) {
            URL.revokeObjectURL(item.preview);
          }
        });

        // Cleanup tất cả blob URLs từ ref
        blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
        blobUrlsRef.current = [];

        return {
          logo: null,
          logoPreview: '',
          heroImages: []
        };
      });

      alert('Layout configuration saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save layout configuration. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Site Appearance</h1>
        <div className="flex space-x-4">
          <Button onClick={handleResetChanges} variant="outline">
            Reset Changes
          </Button>
          <Button onClick={handleSaveChanges} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Header</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="logo">Logo</Label>
              <div className="flex items-center space-x-4 mt-2">
                <img
                  src={localFiles.logoPreview || formData.header.logoUrl || '/api/placeholder/80/80'}
                  alt="Logo"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
                <div className="flex flex-col space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileSelect}
                    className="hidden"
                    id="logo-upload"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('logo-upload')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {localFiles.logo ? 'Logo Selected' : 'Update Logo'}
                  </Button>
                  {(formData.header.logoUrl || localFiles.logo) && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setLocalFiles(prev => {
                          // Cleanup logo preview cũ
                          if (prev.logoPreview) {
                            URL.revokeObjectURL(prev.logoPreview);
                            // Remove từ blobUrlsRef
                            const indexInRef = blobUrlsRef.current.indexOf(prev.logoPreview);
                            if (indexInRef > -1) {
                              blobUrlsRef.current.splice(indexInRef, 1);
                            }
                          }
                          
                          return { 
                            ...prev, 
                            logo: null, 
                            logoPreview: '' 
                          };
                        });
                        
                        setFormData(prev => ({ 
                          ...prev, 
                          header: { 
                            ...prev.header, 
                            logoUrl: '' 
                          } 
                        }));
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Name Business</Label>
              <Input
                id="description"
                className="mt-2"
                value={formData.header.businessName}
                onChange={(e) => handleChangeLayout('header', 'businessName', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="hero-title">Title</Label>
              <Input
                id="hero-title"
                className="mt-2"
                value={formData.hero.title}
                onChange={(e) => handleChangeLayout('hero', 'title', e.target.value)}
                placeholder="Enter hero title"
              />
            </div>
            <div>
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Input
                id="hero-subtitle"
                className="mt-2"
                value={formData.hero.subtitle}
                onChange={(e) => handleChangeLayout('hero', 'subtitle', e.target.value)}
                placeholder="Enter hero subtitle"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hero Images */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Existing images from server */}
            {formData.hero.imageUrls.map((url, index) => (
              <div key={`existing-${index}`} className="relative group">
                <img
                  src={url}
                  alt={`Hero ${index + 1}`}
                  width={300}
                  height={200}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          imageUrls: prev.hero.imageUrls.filter((_, i) => i !== index)
                        }
                      }));
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            {/* New images from local files */}
            {localFiles.heroImages.map((item, index) => (
              <div key={`new-${index}`} className="relative group">
                <img
                  src={item.preview}
                  alt={`New Hero ${index + 1}`}
                  width={300}
                  height={200}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={() => handleRemoveHeroImage(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            {/* Add new image */}
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
              onClick={() => document.getElementById('hero-add')?.click()}
            >
              <div className="text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Add Image</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleHeroImageFileSelect}
                className="hidden"
                id="hero-add"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <div>
          <div className='flex items-center justify-between px-4 gap-5'>
            <Label htmlFor="about">Title</Label>
            <Input
              id="about"
              className="mt-2"
              value={formData.about.title}
              onChange={(e) => handleChangeLayout('about', 'title', e.target.value)}
            />
          </div>
          <CardContent>
            <Textarea
              id="about-content"
              className="mt-2"
              value={formData.about.content}
              onChange={(e) => handleChangeLayout('about', 'content', e.target.value)}
            />
          </CardContent>
        </div>
      </Card>

      {/* Footer */}
      <Card>
        <CardHeader>
          <CardTitle>Footer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                className="mt-2"
                value={formData.footer.phone}
                onChange={(e) => handleChangeLayout('footer', 'phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                className="mt-2"
                value={formData.footer.email}
                onChange={(e) => handleChangeLayout('footer', 'email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                className="mt-2"
                value={formData.footer.address}
                onChange={(e) => handleChangeLayout('footer', 'address', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div>
      {renderContent()}
    </div>
  );
}
