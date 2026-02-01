"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/client";
import { randomUUID } from "crypto";

export async function createTestimonial(formData: FormData) {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        success: false,
        error: "You must be signed in to submit a testimonial.",
      };
    }

    const review = formData.get("review") as string;
    const rating = Number(formData.get("rating"));
    const categoryId = formData.get("categoryId") as string;
    const images = formData.getAll("images") as File[];

    if (!review || !rating || !categoryId) {
      return { success: false, error: "Missing required fields." };
    }

    const uploadedAssets = [];

    if (images && images.length > 0) {
      for (const image of images) {
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
            _type: "image",
            asset: {
              _type: "reference",
              _ref: asset._id,
            },
          });
        }
      }
    }

    const clientName = user.fullName || user.firstName || "Anonymous Client";
    const clientEmail = user.primaryEmailAddress?.emailAddress || "";
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
      category: {
        _type: "reference",
        _ref: categoryId,
      },
      workAssets: uploadedAssets.length > 0 ? uploadedAssets : undefined,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return {
      success: false,
      error: "Failed to submit testimonial. Please try again.",
    };
  }
}
