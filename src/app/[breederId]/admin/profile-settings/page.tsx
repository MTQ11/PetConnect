'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/Label';
import { Upload, Phone, Mail, MapPin } from 'lucide-react';

interface BreederInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  description: string;
}

export default function ProfileSettingsPage({ params }: { params: Promise<{ breederId: string }> }) {
  const resolvedParams = use(params);
  const [breederInfo, setBreederInfo] = useState<BreederInfo>({
    name: "Golden Grace Breeders",
    email: "info@goldengrace.com",
    phone: "+1 (555) 123-4567",
    address: "123 Breeder Lane, Puppy Valley, CA 90210",
    avatar: "/api/placeholder/150/150",
    description: "Award-winning Golden Retriever & Yorkshire Terrier specialists with over 15 years of experience."
  });

  const handleSaveChanges = () => {
    // Save changes logic here
    console.log('Saving profile changes:', breederInfo);
  };

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <Button onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Label>Avatar</Label>
              <div className="flex flex-col items-center mt-2">
                <Image
                  src={breederInfo.avatar}
                  alt="Avatar"
                  width={120}
                  height={120}
                  className="w-30 h-30 object-cover rounded-full border-4 border-gray-200 mb-4"
                />
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Change Avatar
                </Button>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div>
                <Label htmlFor="breeder-name">Breeder Name</Label>
                <Input
                  id="breeder-name"
                  type="text"
                  className="mt-2"
                  defaultValue={breederInfo.name}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  className="mt-2"
                  defaultValue={breederInfo.description}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className="flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                className="mt-2"
                defaultValue={breederInfo.phone}
              />
            </div>
            <div>
              <Label htmlFor="email" className="flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="mt-2"
                defaultValue={breederInfo.email}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address" className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Address
              </Label>
              <Input
                id="address"
                type="text"
                className="mt-2"
                defaultValue={breederInfo.address}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KYC Verification */}
      <Card>
        <CardHeader>
          <CardTitle>KYC Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-green-900">Verified Breeder</p>
                <p className="text-sm text-green-700">Your account has been verified</p>
              </div>
            </div>
            <Badge className="bg-green-500 hover:bg-green-500">
              Verified
            </Badge>
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
