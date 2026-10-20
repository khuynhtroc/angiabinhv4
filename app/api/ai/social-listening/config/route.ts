import { NextRequest, NextResponse } from 'next/server';
import { getAdminConfigServer, saveAdminConfigServer } from '@/lib/server-data';
import { DEFAULT_SOCIAL_LISTENING_CONFIG } from '@/lib/social-listening';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const adminConfig = getAdminConfigServer();
    const config = adminConfig?.socialListening || DEFAULT_SOCIAL_LISTENING_CONFIG;
    return NextResponse.json({
      success: true,
      config
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: 'Lỗi tải cấu hình Social Listening: ' + (err?.message || '')
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const adminConfig = getAdminConfigServer();
    const currentSocial = adminConfig?.socialListening || DEFAULT_SOCIAL_LISTENING_CONFIG;

    const updatedSocial = {
      ...currentSocial,
      ...body
    };

    const updatedAdmin = {
      ...adminConfig,
      socialListening: updatedSocial
    };

    saveAdminConfigServer(updatedAdmin);

    return NextResponse.json({
      success: true,
      config: updatedSocial,
      message: 'Đã lưu cấu hình Social Listening thành công.'
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: 'Lỗi lưu cấu hình Social Listening: ' + (err?.message || '')
    }, { status: 500 });
  }
}
