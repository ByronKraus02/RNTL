import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, Menu } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EquipmentCard from "../components/home/EquipmentCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // ✅ Replaces: base44.entities.Equipment.list('-created_date')
  const { data: equipment = [], isLoading } = useQuery({
    queryKey: ["equipment"],
    queryFn: async () => {
      const res = await fetch("/api/equipment?sort=-created_date");
      if (!res.ok) throw new Error("Failed to fetch equipment");
      return res.json();
    },
  });

  const categories = [
    { value: "all", label: "All Equipment" },
    { value: "speakers", label: "Speakers" },
    { value: "dj_equipment", label: "DJ Equipment" },
    { value: "microphones", label: "Microphones" },
    { value: "lighting", label: "Lighting" },
    { value: "instruments", label: "Instruments" },
    { value: "amplifiers", label: "Amplifiers" },
    { value: "mixers", label: "Mixers" },
    { value: "other", label: "Other" },
  ];

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const isAvailable = item.status === "available";
    return matchesSearch && matchesCategory && isAvailable;
  });

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative bg-black text-white overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-red-900/30"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ff2f00d0c393d22378a59d/929a6ce75_Rntllogophotoroom1.png"
                alt="RNTL"
                className="w-24 h-24 object-contain relative z-10"
              />
              <div className="absolute inset-0 bg-red-600 blur-2xl opacity-60"></div>
              <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-60"></div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-2 tracking-wider">
            RNTL
          </h1>
          <p className="text-cyan-400 text-lg md:text-xl mb-8 tracking-widest">
            SHARE THE SOUND
          </p>
        </div>
      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          <div className="relative">
            <Menu className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search for equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 py-6 text-base bg-gray-200 border-0 rounded-full text-gray-900 placeholder:text-gray-500"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <TabsList className="w-full justify-start overflow-x-auto bg-transparent border-0 p-0 flex-wrap h-auto gap-2">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black bg-gray-800 text-gray-300 rounded-full px-4 py-2 border-0"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Equipment Grid */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-3xl overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
            </div>
          ) : filteredEquipment.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-900 rounded-full flex items-center justify-center border border-gray-800">
                <Search className="w-12 h-12 text-gray-600" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                No equipment found
              </h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search or filters
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="bg-cyan-400 text-black hover:bg-cyan-300 font-semibold"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipment.map((item) => (
                <EquipmentCard key={item.id} equipment={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
