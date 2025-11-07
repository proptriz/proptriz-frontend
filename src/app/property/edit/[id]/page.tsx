'use client';

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import HorizontalCard from "@/components/shared/HorizontalCard";
import { SelectButton } from "@/components/shared/Input";
import ToggleButtons from "@/components/ToggleButtons";
import AddPropertyDetails from "@/components/property/AddDetailsSection";
import PropertyLocationSection from "@/components/property/PropertyLocationSection";
import { ScreenName } from "@/components/shared/LabelCards";

import { mockProperties, categories, styles } from "@/constant";
import getUserPosition from "@/utils/getUserPosition";
import logger from "../../../../../logger.config.mjs";
import { getPropertyById, updateProperty } from "@/services/propertyApi";
import { CategoryEnum, ListForEnum, NegotiableEnum, PropertyType, Feature, RenewalEnum } from "@/types";
import { IoHomeOutline } from "react-icons/io5";
import { FaNairaSign } from "react-icons/fa6";
import ToggleCollapse from "@/components/shared/ToggleCollapse";
import ImageManager from "@/components/ImageManager";

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params); // same pattern you used
  const propertyId = resolvedParams.id;

  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [togglePopup, setTogglePopup] = useState(false);

  // form state (prefilled from API)
  const [property, setProperty] = useState<PropertyType | null>(null);
  const [propertyTitle, setPropertyTitle] = useState<string>("");
  const [listedFor, setListedFor] = useState<ListForEnum>(ListForEnum.rent);
  const [category, setCategory] = useState<CategoryEnum>(CategoryEnum.house);
  const [propertyAddress, setPropertyAddress] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [renewPeriod, setRenewPeriod] = useState<RenewalEnum>(RenewalEnum.yearly);
  const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>(null);
  const [propCoordinates, setPropCoordinates] = useState<[number, number] | null>(null);

  // images: existing remote urls + new Files
  const [existingImages, setExistingImages] = useState<string[]>([]); // remote URLs already saved
  const [replacedImages, setReplacedImages] = useState<{ [index: number]: File }>({});
  const [newPhotos, setNewPhotos] = useState<File[]>([]); // newly selected files
  const maxPhotos = 5;

  // controlled child values from AddPropertyDetails
  const [negotiable, setNegotiable] = useState<NegotiableEnum>(NegotiableEnum.Negotiable);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [facilities, setFacilities] = useState<string[]>([]);

  // listing types (local)
  const listingTypes = useMemo(() => [
    { title: "Sell", value: "sell" },
    { title: "Rent", value: "rent" },
  ], []);

  // get user location once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [lat, lng] = await getUserPosition();
        if (mounted) setUserCoordinates([lat, lng]);
      } catch (err) {
        logger.warn("getUserPosition failed:", err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // fetch property by id and prefill form
  useEffect(() => {
    if (!propertyId) return;
    setLoading(true);
    setError(null);

    let mounted = true;
    (async () => {
      try {
        const res = await getPropertyById(propertyId);
        if (!mounted) return;
        if (!res || !res.id) {
          setError("Property not found");
          setLoading(false);
          return;
        }
        setProperty(res);
        // Prefill local form state
        setPropertyTitle(res.title || "");
        setPrice(res.price ?? 0);
        setCategory((res.category as CategoryEnum) ?? CategoryEnum.house);
        setListedFor((res.listed_for as ListForEnum) ?? ListForEnum.rent);
        setRenewPeriod((res.period  as RenewalEnum)  ?? RenewalEnum.yearly);
        setPropertyAddress(res.address || "");

        // Coordinates
        if (typeof res.latitude === "number" && typeof res.longitude === "number") {
          setPropCoordinates([res.latitude, res.longitude]);
        }
        // Map coordinates may be returned as longitude & latitude (your pipeline)
        if (typeof res.latitude === "number" && typeof res.longitude === "number") {
          setPropCoordinates([res.latitude, res.longitude]);
        }
        // Negotiable, features, facilities
        setNegotiable(res.negotiable ? NegotiableEnum.Negotiable : NegotiableEnum.NonNegotiable);
        setFeatures(Array.isArray(res.features) ? res.features : []);
        setFacilities(res.env_facilities || []);
        // images (only urls)
        const imgs = Array.isArray(res.images) ? res.images.filter(Boolean) : [];
        setExistingImages(imgs);
      } catch (err: any) {
        logger.error("error fetching property:", err?.message ?? err);
        setError(err?.message ?? "Failed to fetch property");
      } finally {
        setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [propertyId]);

  // Photo upload handlers
  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const uploaded = Array.from(e.target.files).filter(f => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024);
    if (existingImages.length + newPhotos.length + uploaded.length > maxPhotos) {
      toast.error(`You can only upload up to ${maxPhotos} photos`);
      return;
    }
    setNewPhotos(prev => [...prev, ...uploaded]);
  }, [existingImages.length, newPhotos.length]);


  // location select callback
  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    setPropCoordinates([lat, lng]);
    toast.success(`Location selected: (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
  }, []);

  // 🗑️ Remove existing image from the list
  const removeExistingImage = (index: number) => {
    if (!property) return;
    const updated = property.images.filter((_: string, i: number) => i !== index);
    setProperty((prev: any) => ({ ...prev, images: updated }));
    toast.success("Image removed");
  };

  // 🔁 Replace existing image with a new file
  const replaceExistingImage = (index: number, file: File) => {
    setReplacedImages((prev) => ({ ...prev, [index]: file })); // track the replaced one
    toast.success(`Image ${index + 1} replaced`);
  };

  // ➕ Add new uploaded photo (filling up remaining slots)
  const handleNewPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const total = newPhotos.length + (property?.images?.length || 0) + files.length;
    if (total > 5) {
      toast.error("You can only upload up to 5 images total");
      return;
    }

    setNewPhotos((prev) => [...prev, ...files]);
  };


  // 🧾 Gather all image data to send to API on save
  // const handleSubmit = async () => {
  //   const formData = new FormData();

  //   // Append other fields (example)
  //   formData.append("title", property.title);
  //   formData.append("price", property.price);

  //   // Include existing image URLs (minus deleted ones)
  //   formData.append("existing_images", JSON.stringify(property.images));

  //   // Include replaced images (by index)
  //   Object.entries(replacedImages).forEach(([index, file]) => {
  //     formData.append(`replace_images[${index}]`, file);
  //   });

  //   // Append new photos
  //   newPhotos.forEach((file) => formData.append("images", file));

  //   // Submit to API
  //   try {
  //     // example: await updateProperty(property.id, formData)
  //     toast.success("Property updated successfully!");
  //   } catch (err) {
  //     toast.error("Failed to update property");
  //   }
  // };


  // const handleSubmit = useCallback(async () => {
  //   if (
  //     !propertyTitle ||
  //     !listedFor ||
  //     !category ||
  //     !price ||
  //     (existingImages.length + newPhotos.length) === 0
  //   ) {
  //     toast.error("Please fill required fields and include at least one photo.");
  //     return;
  //   }

  //   setSubmitLoading(true);
  //   try {
  //     // Prepare plain object for data
  //     const updateData: Partial<PropertyType> = {
  //       title: propertyTitle,
  //       price: Number(price),
  //       address: property?.address ?? "",
  //       listed_for: listedFor,
  //       category,
  //       negotiable: negotiable === NegotiableEnum.Negotiable,
  //       status: property?.status ?? "available",
  //       latitude: propCoordinates?.[0],
  //       longitude: propCoordinates?.[1],
  //       features: features || [],
  //       env_facilities: facilities || [],
  //       period: listedFor === ListForEnum.rent ? renewPeriod : undefined,
  //       existing_images: existingImages, // to let backend keep old images
  //     };

  //     // Call update API
  //     const response = await updateProperty(propertyId, updateData, newPhotos);

  //     if (response?.success) {
  //       setSubmitSuccess(true);
  //       toast.success("Property updated successfully");
  //       setTimeout(() => router.push("/properties"), 800);
  //     } else {
  //       toast.error(response?.message || "Failed to update property");
  //     }
  //   } catch (err: any) {
  //     logger.error("Update property failed:", err?.message ?? err);
  //     toast.error(err?.message ?? "Unexpected error");
  //   } finally {
  //     setSubmitLoading(false);
  //   }
  // }, [
  //   propertyId,
  //   propertyTitle,
  //   listedFor,
  //   category,
  //   price,
  //   propCoordinates,
  //   features,
  //   facilities,
  //   existingImages,
  //   newPhotos,
  //   negotiable,
  //   renewPeriod,
  //   property,
  //   router,
  // ]);


  // derived previews for rendering
  const newPhotoPreviews = useMemo(() => newPhotos.map((f) => ({ url: URL.createObjectURL(f), name: f.name })), [newPhotos]);

  if (loading) {
    return <div className="p-6">Loading property...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error loading property: {error}</div>;
  }

  return (
    <div className="pb-16 min-h-screen relative">
      <ScreenName title="Edit Property" />
      <div className="p-6 max-w-4xl mx-auto">
        {/* Property preview card */}
        <div>
          <HorizontalCard
            id={property?.id ?? ''}
            name={property?.title ?? ''}
            price={property?.price ?? 0}
            category={property?.category ?? ''}
            address={property?.address ?? ''}
            image={existingImages[0] ?? ''}
            period={property?.period ?? ''}
            listed_for={property?.listed_for ?? ''}
            rating={0}
          />
        </div>

        <div className="mt-8 space-y-6">
          {/* Title */}
          <div>
            <h3 className={styles.H2}>Property title</h3>
            <div className="flex card-bg p-3 rounded-full shadow-md">
              <input
                name="title"
                value={propertyTitle}
                onChange={(e) => setPropertyTitle(e.target.value)}
                type="text"
                placeholder="Property title here"
                className="w-full outline-none card-bg"
              />
              <button className="text-gray-500 text-lg px-3" disabled>
                <IoHomeOutline className="font-bold" />
              </button>
            </div>
          </div>

          {/* Price */}
          <div>
            <h3 className={styles.H2}>
              {listedFor === ListForEnum.rent ? "Rent Price" : "Sell Price"}
            </h3>
            <div className="flex card-bg p-3 rounded-lg shadow-md">
              <input
                name="price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                type="number"
                placeholder="Property price here"
                className="w-full outline-none card-bg"
              />
              <button className="text-gray-500 text-lg px-3">
                <FaNairaSign className="font-bold" />
              </button>
            </div>
          </div>

          {/* Property Address */}
          <div>
            <h3 className={styles.H2}>Property Address</h3>
            <div className="flex card-bg p-3 rounded-full shadow-md">
              <input
                name="address"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                type="text"
                placeholder="Property Address here"
                className="w-full outline-none card-bg"
              />
              <button className="text-gray-500 text-lg px-3" disabled>
                <IoHomeOutline className="font-bold" />
              </button>
            </div>
          </div>          

          {/* Listed For */}
          <ToggleButtons<ListForEnum>
            label="Listed For"
            options={[ListForEnum.sale, ListForEnum.rent]}
            selected={listedFor}
            onChange={setListedFor}
          />

          {listedFor === ListForEnum.rent && (
            <ToggleButtons<RenewalEnum>
              label="renewPeriod Period"
              options={[RenewalEnum.monthly, RenewalEnum.yearly]}
              selected={renewPeriod}
              onChange={setRenewPeriod}
            />
          )}

          {/* Property Category */}
          <h3 className={styles.H2}>Property Category</h3>
          <SelectButton<CategoryEnum> list={categories} setValue={setCategory} name="category" value={category} />

          {/* Location Section */}
          <PropertyLocationSection
            userCoordinates={userCoordinates}
            fallbackCoordinates={[mockProperties[0].latitude, mockProperties[0].longitude]}
            onLocationSelect={handleLocationSelect}
          />

          {/* Photo upload / previews */}
          <ImageManager
            property={property}
            removeExistingImage={removeExistingImage}
            replaceExistingImage={replaceExistingImage}
            handleNewPhotoUpload={handleNewPhotoUpload}
            newPhotos={newPhotos}
            setNewPhotos={setNewPhotos}
          />

          {/* Property Details - controlled via callbacks */}
          <AddPropertyDetails
            listingCategory={category}
            existingFeatures={features}
            existingFacilities={facilities}
            onNegotiableChange={setNegotiable}
            onFeaturesChange={setFeatures}
            onFacilitiesChange={setFacilities}
          />

          {/* Submit */}
          <div className="mt-6">
            <button
              className="w-full bg-green text-white py-2 rounded-md"
              // onClick={handleSubmit}
              disabled={submitLoading}
            >
              {submitLoading ? "Updating..." : "Update Property"}
            </button>
          </div>
        </div>

        {/* success/error popup (simple) */}
        {togglePopup && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white p-4 rounded shadow">
            {submitSuccess ? (
              <div>
                <p className="font-semibold">Property updated</p>
                <button onClick={() => setTogglePopup(false)} className="mt-2 underline">Close</button>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-red-600">Update failed</p>
                <button onClick={() => setTogglePopup(false)} className="mt-2 underline">Close</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
