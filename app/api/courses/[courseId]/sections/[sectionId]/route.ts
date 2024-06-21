import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});
export const POST = async (request: NextRequest, { params }: { params: { courseId: string; sectionId: string } }) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, sectionId } = params;
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        instructorId: userId,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }
    const values = await request.json();
    const section = await db.section.update({
      where: {
        id: sectionId,
        courseId,
      },
      data: {
        ...values,
      },
    });

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          sectionId,
        },
      });

      if (existingMuxData) {
        await mux.video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
      const asset = await mux.video.assets.create({
        input: values.videoUrl,
        playback_policy: ["public"],
        test: false,
      });

      await db.muxData.create({
        data: {
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
          sectionId,
        },
      });
    }
    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    console.log(["section_POST", error]);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (request: NextRequest, { params }: { params: { courseId: string; sectionId: string } }) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, sectionId } = params;

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        instructorId: userId,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", {
        status: 404,
      });
    }

    const section = await db.section.findUnique({
      where: {
        id: sectionId,
        courseId,
      },
    });

    if (!section) {
      return new NextResponse("Section not found", { status: 404 });
    }
    //xoa video duoc luu tru tren mux va database
    if (section.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          sectionId,
        },
      });

      if (existingMuxData) {
        await mux.video.assets.delete(existingMuxData.assetId); //xoa  video duoc luu tru trne he thong mux cloud
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }

    await db.section.delete({
      where: {
        id: sectionId,
        courseId,
      },
    });

    //tim tat ca cac khoa hoc co chut mot section trong do
    const publishedSectionsInCourse = await db.section.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (!publishedSectionsInCourse.length) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }
    return new NextResponse("Section deleted", { status: 200 });
  } catch (error) {
    console.log(["section_DELETE", error]);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
