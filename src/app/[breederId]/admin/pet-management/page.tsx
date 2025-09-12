'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    Plus,
    Edit,
    Eye,
    EyeOff,
    Trash2,
    Search,
    Filter,
    MoreHorizontal,
    Upload
} from 'lucide-react';
import { Pet } from '@/types';
import { useMyPetsData } from '@/lib/hooks/useMyPetsData';
import { MyPetCard } from '@/components/features/MyPetCard';

export default function PetManagementPage({ params }: { params: Promise<{ breederId: string }> }) {
    const { myPets, loading, error } = useMyPetsData();
    const resolvedParams = use(params);

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'add' | 'edit'>('add');
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

    // Mock data
    //   const pets: Pet[] = [
    //     {
    //       id: "1",
    //       name: "Bella",
    //       breed: "Golden Retriever",
    //       age: "8 weeks",
    //       price: "$1,200",
    //       image: "/api/placeholder/300/300",
    //       status: "active",
    //       description: "Beautiful Golden Retriever puppy with excellent temperament.",
    //       featured: true
    //     },
    //     {
    //       id: "2",
    //       name: "Charlie",
    //       breed: "Yorkshire Terrier",
    //       age: "10 weeks",
    //       price: "$800",
    //       image: "/api/placeholder/300/300",
    //       status: "active",
    //       description: "Playful Yorkshire Terrier, great with kids.",
    //       featured: false
    //     },
    //     {
    //       id: "3",
    //       name: "Luna",
    //       breed: "Golden Retriever",
    //       age: "12 weeks",
    //       price: "$1,300",
    //       image: "/api/placeholder/300/300",
    //       status: "hidden",
    //       description: "Calm and gentle Golden Retriever puppy.",
    //       featured: false
    //     }
    //   ];

    const openModal = (type: 'add' | 'edit', pet?: Pet) => {
        setModalType(type);
        setSelectedPet(pet || null);
        setShowModal(true);
    };

    const togglePetStatus = (petId: string) => {
        // Toggle pet status logic here
        console.log('Toggle pet status:', petId);
    };

    const deletePet = (petId: string) => {
        // Delete pet logic here
        console.log('Delete pet:', petId);
    };

    const renderModal = () => {
        if (!showModal) return null;

        return (
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {modalType === 'add' && 'Add New Pet'}
                            {modalType === 'edit' && 'Edit Pet'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Pet Image</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">Click to upload image</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <Input
                                        type="text"
                                        defaultValue={selectedPet?.name || ''}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
                                    <Input
                                        type="text"
                                        defaultValue={selectedPet?.breed.name_vi || ''}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                                    <Input
                                        type="text"
                                        defaultValue={selectedPet?.age || ''}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                                    <Input
                                        type="text"
                                        defaultValue={selectedPet?.price || ''}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <Textarea
                                    rows={3}
                                    defaultValue={selectedPet?.description || ''}
                                />
                            </div>

                            {/* <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="featured"
                                        defaultChecked={selectedPet?.featured || false}
                                    />
                                    <label htmlFor="featured" className="text-sm text-gray-700">Featured Pet</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="active"
                                        defaultChecked={selectedPet?.status === 'active'}
                                    />
                                    <label htmlFor="active" className="text-sm text-gray-700">Active</label>
                                </div>
                            </div> */}
                        </form>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button>
                            {modalType === 'add' ? 'Add Pet' : 'Save Changes'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    const renderContent = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Pets Management</h1>
                <Button onClick={() => openModal('add')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Pet
                </Button>
            </div>

            {/* Search and Filter */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex space-x-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                type="text"
                                placeholder="Search pets..."
                                className="pl-10"
                            />
                        </div>
                        <Button variant="outline">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Pets Grid */}
            <div className="flex flex-col gap-2">
                {myPets.map((pet: Pet) => (
                    <MyPetCard key={pet.id} pet={pet} />
                ))}
            </div>
        </div>
    );

    return (
        <div>
            {renderContent()}
            {renderModal()}
        </div>
    );
}
