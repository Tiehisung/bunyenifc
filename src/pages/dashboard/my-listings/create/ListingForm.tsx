import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  HiOutlineArrowLeft,
  HiOutlineCheck,
  HiOutlineStar,
} from "react-icons/hi2";

import {
  useCreateListingMutation,
  useUpdateListingMutation,
} from "@/services/listingsApi";
import { Input, Select, Textarea } from "@/components/form";
import { ImageUpload, validateImages } from "@/components/form/ImageUpload";
import {
  createListingSchema,
  type ICreateListingFormData,
} from "../validations";
import { Button } from "@/components/buttons/Button";
import { useListingForm } from "@/hooks/useListingForm";
import { useGetBrandsQuery } from "@/services/brandApi";
import { useGetLocationsQuery } from "@/services/locationApi";
import { CONDITIONS } from "@/data/motor";
import { EDocumentType, IListing } from "@/types/listing";
import PaymentModal from "../../payments/PaymentModal";
import { enumToOptions } from "@/lib/select";
import { usePricing } from "@/hooks/usePricing";

// CONSTANTS
const TOTAL_STEPS = 5;

const DOCUMENT_TYPES = [
  { value: "", label: "Select document type" },
  ...enumToOptions(EDocumentType),
];

const STEP_FIELDS: Record<number, (keyof ICreateListingFormData)[]> = {
  1: ["brand"],
  2: ["condition", "price", "location"],
  3: ["description"],
  4: [],
  5: ["listingType"],
};

// TYPES
interface ListingFormProps {
  existingListing?: IListing;
}

const ListingForm = ({ existingListing }: ListingFormProps) => {
  const { listingFeeOptions, isLoading: isPricingLoading } = usePricing();

  const navigate = useNavigate();
  const { data: brandsData } = useGetBrandsQuery();
  const { data: locationsData } = useGetLocationsQuery();

  // PAYMENT MODAL STATE

  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    listingId: "",
    listingTitle: "",
    amount: 0,
  });

  // Build brand options from API
  const brandOptions = [
    { value: "", label: "Select brand" },
    ...(brandsData?.data || []).map((brand) => ({
      value: brand.name,
      label: `${brand.name}${brand.isPopular ? " ⭐" : ""}`,
    })),
  ];

  // Build location options from API
  const locationOptions = [
    { value: "", label: "Select location" },
    ...(locationsData?.data || []).map((loc) => ({
      value: loc.name,
      label: loc.name,
    })),
  ];

  const [createListing, { isLoading: isCreating }] = useCreateListingMutation();
  const [updateListing, { isLoading: isUpdating }] = useUpdateListingMutation();

  const isLoading = isCreating || isUpdating;

  // Redux form state (create mode only)
  const {
    formData,
    currentStep,
    lastSaved,
    updateMultipleFields,
    setCurrentStep,
    submitSuccess,
    clearForm,
  } = useListingForm();

  // Build default values based on mode
  const getDefaultValues = () => {
    if (existingListing) {
      return {
        ...existingListing,
        images: existingListing.images || [],
      };
    }
    return formData;
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
    reset,
  } = useForm<ICreateListingFormData>({
    resolver: zodResolver(createListingSchema as any),
    mode: "onChange",
    defaultValues: getDefaultValues(),
  });

  console.log(errors);
  // Sync Redux → Form on mount (create mode only)
  useEffect(() => {
    if (!existingListing) {
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          setValue(key as keyof ICreateListingFormData, value);
        }
      });
    } else {
      reset({ ...existingListing });
    }
  }, [existingListing]);

  // Watch values
  const hasDocuments = watch("hasDocuments");
  const watchedImages = watch("images") || [];

  // HANDLERS

  const handleImagesChange = useCallback(
    (urls: string[]) => {
      setValue("images", urls, { shouldValidate: true, shouldDirty: true });
      if (!existingListing) {
        updateMultipleFields({ images: urls } as any);
      }
    },
    [setValue, updateMultipleFields, existingListing],
  );

  const handleNextStep = async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep] || [];

    if (currentStep === 4) {
      const imageError = validateImages(watchedImages as string[]);
      if (imageError) {
        toast.error(imageError);
        return;
      }
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return;
    }

    const currentValues = watch();
    if (!existingListing) {
      updateMultipleFields(currentValues);
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    const currentValues = watch();
    if (!existingListing) {
      updateMultipleFields(currentValues);
    }
    setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data: ICreateListingFormData) => {
    try {
      if (existingListing?._id) {
        // ============ EDIT MODE ============
        const result = await updateListing({
          id: existingListing._id,
          data,
        }).unwrap();
        toast.success("Listing updated!", {
          description: "Your changes have been saved.",
        });
        if (!result.data.listingFee) {
          setPaymentModal({
            isOpen: true,
            listingId: result.data._id,
            listingTitle:
              `${result.data.brand} ${result.data.model || ""}`.trim(),
            amount:
              result.data.listingFee ||
              (data.listingType === "premium" ? 40 : 25),
          });
        }
        reset({});
        navigate(`/listing/${result.data._id}`);
      } else {
        // ============ CREATE MODE ============
        const result = await createListing(data).unwrap();
        submitSuccess();
        clearForm();

        // Open payment modal
        setPaymentModal({
          isOpen: true,
          listingId: result.data._id,
          listingTitle:
            `${result.data.brand} ${result.data.model || ""}`.trim(),
          amount:
            result.data.listingFee ||
            (data.listingType === "premium" ? 40 : 25),
        });
        reset({});
      }
    } catch (err: any) {
      toast.error(
        existingListing
          ? "Failed to update listing"
          : "Failed to create listing",
        { description: err?.data?.message || "Please try again" },
      );
    }
  };

  const handlePaymentSuccess = () => {
    toast.success("Payment confirmed! Your listing is now live.", {
      description: "It will be visible after admin approval.",
    });
  };

  const handlePaymentClose = () => {
    setPaymentModal((prev) => ({ ...prev, isOpen: false }));
    navigate(`/listing/${paymentModal.listingId}`);
  };

  const formatLastSaved = () => {
    if (!lastSaved) return null;
    return new Date(lastSaved).toLocaleTimeString();
  };

  // RENDER HELPERS

  const renderStep = (step: number, content: React.ReactNode) => {
    if (existingListing || currentStep === step) {
      return content;
    }
    return null;
  };

  // RENDER

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-surface-muted rounded-xl transition-colors"
          >
            <HiOutlineArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-surface-foreground">
              {existingListing ? "Edit Listing" : "Create Listing"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {existingListing
                ? `${existingListing?.brand || "Bike"} ${existingListing?.model || ""}`.trim()
                : `Step ${currentStep} of ${TOTAL_STEPS}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {existingListing && (
            <span className="text-xs text-warning bg-warning/10 px-2 py-1 rounded-lg font-medium">
              Editing
            </span>
          )}
          {!existingListing && lastSaved && (
            <span className="text-xs text-muted-foreground bg-surface-muted px-2 py-1 rounded-lg">
              💾 {formatLastSaved()}
            </span>
          )}
        </div>
      </div>

      {/* Progress (create mode only) */}
      {!existingListing && (
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i + 1 <= currentStep ? "bg-brand" : "bg-surface-muted"
              }`}
            />
          ))}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ============ STEP 1: BIKE DETAILS ============ */}
        {renderStep(
          1,
          <div className="space-y-4 bg-surface-elevated border border-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Bike Details
            </h2>
            <Controller
              control={control}
              name="brand"
              render={({ field }) => (
                <Select
                  label="Brand"
                  required
                  options={brandOptions}
                  error={errors.brand?.message}
                  {...field}
                />
              )}
            />
            <Input
              label="Model"
              placeholder="e.g., Super 125"
              error={errors.model?.message}
              {...register("model")}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Year"
                type="number"
                placeholder="e.g., 2022"
                error={errors.year?.message}
                {...register("year", { valueAsNumber: true })}
              />
              <Input
                label="Engine (cc)"
                type="number"
                placeholder="e.g., 125"
                error={errors.engineCapacity?.message}
                {...register("engineCapacity", { valueAsNumber: true })}
              />
            </div>
            <Input
              label="Mileage (km)"
              type="number"
              placeholder="e.g., 15000"
              error={errors.mileage?.message}
              {...register("mileage", { valueAsNumber: true })}
            />
          </div>,
        )}

        {/* ============ STEP 2: CONDITION & PRICE ============ */}
        {renderStep(
          2,
          <div className="space-y-4 bg-surface-elevated border border-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Condition & Price
            </h2>
            <Controller
              control={control}
              name="condition"
              render={({ field }) => (
                <Select
                  label="Condition"
                  required
                  options={CONDITIONS}
                  error={errors.condition?.message}
                  {...field}
                />
              )}
            />
            <Input
              label="Price (GHS)"
              required
              type="number"
              placeholder="Enter price"
              error={errors.price?.message}
              {...register("price", { valueAsNumber: true })}
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-border text-brand focus:ring-brand/20"
                {...register("priceNegotiable")}
              />
              <span className="text-sm text-surface-foreground">
                Price is negotiable
              </span>
            </label>
            <Controller
              control={control}
              name="location"
              render={({ field }) => (
                <Select
                  label="Location"
                  required
                  options={locationOptions}
                  error={errors.location?.message}
                  {...field}
                />
              )}
            />
          </div>,
        )}

        {/* ============ STEP 3: DETAILS & DOCUMENTS ============ */}
        {renderStep(
          3,
          <div className="space-y-4 bg-surface-elevated border border-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Details & Documents
            </h2>
            <Textarea
              label="Description"
              placeholder="Describe your bike..."
              error={errors.description?.message}
              {...register("description")}
            />
            <Input
              label="Reason for selling"
              placeholder="e.g., Upgrading to a car"
              error={errors.reasonForSelling?.message}
              {...register("reasonForSelling")}
            />
            <div className="border-t border-border pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-brand focus:ring-brand/20"
                  {...register("hasDocuments")}
                />
                <span className="text-sm font-medium text-surface-foreground">
                  I have registration documents
                </span>
              </label>
              {hasDocuments && (
                <div className="mt-3 ml-6 space-y-3">
                  <Controller
                    control={control}
                    name="documentType"
                    render={({ field }) => (
                      <Select
                        label="Document type"
                        options={DOCUMENT_TYPES}
                        error={errors.documentType?.message}
                        {...field}
                      />
                    )}
                  />
                  <Input
                    label="Chassis Number"
                    placeholder="Enter chassis number"
                    error={errors.chassisNumber?.message}
                    {...register("chassisNumber")}
                  />
                  <Input
                    label="Engine Number"
                    placeholder="Enter engine number"
                    error={errors.engineNumber?.message}
                    {...register("engineNumber")}
                  />
                </div>
              )}
            </div>
          </div>,
        )}

        {/* ============ STEP 4: PHOTOS ============ */}
        {renderStep(
          4,
          <div className="space-y-4 bg-surface-elevated border border-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Photos
            </h2>
            <ImageUpload
              label="Bike Photos"
              value={(watchedImages as string[]) || []}
              onChange={handleImagesChange}
              error={errors.images?.message}
              maxFiles={10}
            />
          </div>,
        )}

        {/* ============ STEP 5: LISTING TYPE ============ */}
        {renderStep(
          5,
          <div className="space-y-4 bg-surface-elevated border border-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Listing Type
            </h2>
            <Controller
              control={control}
              name="listingType"
              render={({ field }) => (
                <div className="space-y-3">
                  {isPricingLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-24 bg-muted rounded-2xl _shimmer"
                        />
                      ))}
                    </div>
                  ) : listingFeeOptions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No listing options available.
                    </p>
                  ) : (
                    listingFeeOptions.map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => field.onChange(option.key)}
                        className={`w-full text-left p-5 rounded-2xl border transition-all ${
                          field.value === option.key
                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                            : "border-border hover:bg-muted"
                        } ${option.isPopular ? "relative" : ""}`}
                      >
                        {/* Popular badge */}
                        {option.isPopular && (
                          <span className="absolute -top-3 right-4 inline-flex items-center gap-1 px-3 py-1 bg-warning text-warning-foreground text-[10px] font-bold rounded-full uppercase tracking-wider">
                            <HiOutlineStar className="w-3 h-3" />
                            Most Popular
                          </span>
                        )}

                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground text-base">
                                {option.label}
                              </span>
                              {field.value === option.key && (
                                <span className="inline-flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground rounded-full">
                                  <HiOutlineCheck className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                              {option.description}
                            </p>

                            {/* Features */}
                            {option.features && option.features.length > 0 && (
                              <ul className="mt-3 space-y-1">
                                {option.features.map((feature, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-center gap-2 text-xs text-muted-foreground"
                                  >
                                    <HiOutlineCheck className="w-3 h-3 text-success shrink-0" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          <div className="text-right shrink-0 ml-4">
                            <p className="text-2xl font-bold text-primary">
                              {option.currency} {option.amount.toFixed(0)}
                            </p>
                            {option.metadata?.durationDays && (
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {option.metadata.durationDays}-day listing
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            />
            {errors.listingType?.message && (
              <p className="text-xs text-red-500">
                {errors.listingType.message}
              </p>
            )}
          </div>,
        )}

        {/* ============ NAVIGATION ============ */}
        <div className="flex gap-3">
          {!existingListing && currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2.5 bg-surface-elevated border border-border rounded-xl text-sm font-medium
                text-surface-foreground hover:bg-surface-muted transition-colors"
            >
              Back
            </button>
          )}

          {/* Do not combine these two logic */}
          {currentStep < TOTAL_STEPS && (
            <Button
              type="button"
              onClick={handleNextStep}
              text="Continue"
              size="lg"
              className="rounded-xl grow"
            />
          )}

          {currentStep >= TOTAL_STEPS && (
            <Button
              type="submit"
              loading={isLoading}
              text={existingListing ? "Save Changes" : "Create Listing"}
              loadingText={existingListing ? "Saving..." : "Creating..."}
              size="lg"
              className="rounded-xl grow"
            />
          )}
        </div>
      </form>

      {/* ============ PAYMENT MODAL ============ */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={handlePaymentClose}
        listingId={paymentModal.listingId}
        listingTitle={paymentModal.listingTitle}
        amount={paymentModal.amount}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default ListingForm;
