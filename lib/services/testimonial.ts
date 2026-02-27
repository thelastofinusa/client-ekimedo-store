import { writeClient } from "@/sanity/lib/client";
import { randomUUID } from "crypto";

interface UserInfo {
  id: string;
  fullName?: string | null;
  firstName?: string | null;
  email?: string | null;
  imageUrl?: string | null;
}

export async function createTestimonialService(
  formData: FormData,
  user: UserInfo,
) {
  try {
    const review = formData.get("review") as string;
    const ratingRaw = formData.get("rating") as string;
    const serviceRaw = formData.get("service") as string;
    const customService = formData.get("customService") as string | null;
    const workAssets = formData.getAll("workAssets") as File[];

    const rating = Number(ratingRaw);
    const service =
      serviceRaw === "custom" ? customService?.trim() : serviceRaw;

    if (!review || !service || Number.isNaN(rating)) {
      return { success: false, error: "Missing or invalid required fields." };
    }

    const uploadedAssets = [];

    if (workAssets && workAssets.length > 0) {
      for (const image of workAssets) {
        if (image.size > 0) {
          const buffer = await image.arrayBuffer();
          const asset = await writeClient.assets.upload(
            "image",
            Buffer.from(buffer),
            {
              filename: image.name,
            },
          );
          uploadedAssets.push({
            _key: randomUUID(),
            _type: "asset",
            asset: {
              _type: "reference",
              _ref: asset._id,
            },
          });
        }
      }
    }

    const clientName = user.fullName || user.firstName || "Anonymous Client";
    const clientEmail = user.email || "";
    const clientAvatar = user.imageUrl || "";

    await writeClient.create({
      _type: "testimonial",
      status: "pending",
      name: clientName,
      clerkUser: {
        name: clientName,
        email: clientEmail,
        avatarUrl: clientAvatar,
        clerkId: user.id,
      },
      review,
      rating,
      date: new Date().toISOString(),
      service,
      workAssets: uploadedAssets.length > 0 ? uploadedAssets : undefined,
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return {
      success: false,
      error: "Failed to submit testimonial. Please try again.",
    };
  }
}
