
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin, User, Phone, Calendar as CalendarIcon, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format, differenceInDays } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function EquipmentDetails() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const equipmentId = urlParams.get('id');

  const [dateRange, setDateRange] = useState(undefined);
  const [error, setError] = useState(null);

  const { data: equipment, isLoading } = useQuery({
    queryKey: ['equipment', equipmentId],
    queryFn: async () => {
      const items = await base44.entities.Equipment.filter({ id: equipmentId });
      return items[0];
    },
    enabled: !!equipmentId,
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  const handleBooking = async () => {
    if (!user) {
      base44.auth.redirectToLogin(window.location.pathname + window.location.search);
      return;
    }

    if (!dateRange?.from) {
      setError("Please select rental dates");
      return;
    }

    const startDate = format(dateRange.from, "yyyy-MM-dd");
    const endDate = format(dateRange.to || dateRange.from, "yyyy-MM-dd");

    // Navigate to payment page
    navigate(createPageUrl("Payment") + `?equipment_id=${equipmentId}&start_date=${startDate}&end_date=${endDate}`);
  };

  const handleMessageOwner = () => {
    if (!user) {
      base44.auth.redirectToLogin(window.location.pathname + window.location.search);
      return;
    }
    
    navigate(createPageUrl("Messages") + `?equipment_id=${equipmentId}&owner_email=${equipment.created_by}`);
  };

  const calculateTotal = () => {
    if (!dateRange?.from || !equipment) return 0;
    const endDate = dateRange.to || dateRange.from;
    const days = differenceInDays(endDate, dateRange.from) + 1;
    return days * equipment.price_per_day;
  };

  const categoryColors = {
    speakers: "bg-blue-500 text-white",
    dj_equipment: "bg-red-500 text-white",
    microphones: "bg-pink-500 text-white",
    lighting: "bg-yellow-500 text-white",
    instruments: "bg-green-500 text-white",
    amplifiers: "bg-orange-500 text-white",
    mixers: "bg-indigo-500 text-white",
    other: "bg-gray-500 text-white",
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8 bg-black min-h-screen">
        <Skeleton className="h-8 w-32 mb-6 bg-gray-800" />
        <div className="grid lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 rounded-xl bg-gray-800" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4 bg-gray-800" />
            <Skeleton className="h-24 w-full bg-gray-800" />
            <Skeleton className="h-64 w-full bg-gray-800" />
          </div>
        </div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8 text-center bg-black min-h-screen">
        <h2 className="text-2xl font-bold mb-4 text-white">Equipment not found</h2>
        <Button onClick={() => navigate(createPageUrl("Home"))} className="bg-cyan-400 text-black hover:bg-cyan-300">
          Back to Browse
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 bg-black min-h-screen">
      <Button
        variant="ghost"
        onClick={() => navigate(createPageUrl("Home"))}
        className="mb-6 hover:bg-gray-900 text-gray-300"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Browse
      </Button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Equipment Image and Details */}
        <div className="space-y-6">
          <div className="relative h-96 bg-gray-200 rounded-3xl overflow-hidden shadow-lg">
            {equipment.image_url ? (
              <img
                src={equipment.image_url}
                alt={equipment.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                <span className="text-9xl opacity-30">🎵</span>
              </div>
            )}
            <div className="absolute top-4 right-4">
              <Badge className={`${categoryColors[equipment.category]} border-0 shadow-lg text-sm`}>
                {equipment.category?.replace(/_/g, ' ')}
              </Badge>
            </div>
          </div>

          <Card className="bg-gray-200 shadow-lg border-0 rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <MapPin className="w-5 h-5 text-red-600" />
                Pickup Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold text-gray-900">{equipment.location}</p>
              </div>
              {equipment.address && (
                <div>
                  <p className="text-sm text-gray-600">Full Address</p>
                  <p className="font-semibold text-gray-900">{equipment.address}</p>
                </div>
              )}
              {equipment.contact_number && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <span className="font-semibold text-gray-900">{equipment.contact_number}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Booking Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {equipment.name}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-3xl font-bold text-cyan-400">
                R{equipment.price_per_day}
              </div>
              <span className="text-gray-400">per day</span>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              {equipment.description || "No description available"}
            </p>
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <Badge variant="outline" className="border-gray-600 text-gray-300">
                Condition: {equipment.condition}
              </Badge>
              <Badge className="bg-green-600 text-white border-0">
                {equipment.status === 'available' ? '✓ Available' : 'Unavailable'}
              </Badge>
            </div>
          </div>

          {user?.email !== equipment.created_by && (
            <Button
              onClick={handleMessageOwner}
              variant="outline"
              className="w-full border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-semibold"
            >
              Message Owner
            </Button>
          )}

          <Card className="bg-gray-200 shadow-lg border-0 rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <CalendarIcon className="w-5 h-5 text-red-600" />
                Select Rental Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block text-gray-900">Select Date or Date Range</Label>
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border border-gray-300 p-3 bg-white"
                  />
                </div>
              </div>

              {dateRange?.from && (
                <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Rental Period:</span>
                    <span className="font-semibold text-white">
                      {dateRange.to ? (
                        <>
                          {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
                          <span className="text-cyan-400 ml-2">
                            ({differenceInDays(dateRange.to, dateRange.from) + 1} days)
                          </span>
                        </>
                      ) : (
                        <>
                          {format(dateRange.from, "MMM d, yyyy")}
                          <span className="text-cyan-400 ml-2">(1 day)</span>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Daily Rate:</span>
                    <span className="font-semibold text-white">R{equipment.price_per_day}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-white">Total Amount:</span>
                      <span className="text-2xl font-bold text-cyan-400">
                        R{calculateTotal()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      💰 Payment will be held in escrow until equipment is delivered
                    </p>
                  </div>
                </div>
              )}

              <Button
                onClick={handleBooking}
                disabled={!dateRange?.from || equipment.status !== 'available'}
                className="w-full bg-cyan-400 text-black hover:bg-cyan-300 font-bold py-6 text-lg rounded-full"
              >
                {!user ? (
                  "Login to Book"
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Continue to Payment
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
