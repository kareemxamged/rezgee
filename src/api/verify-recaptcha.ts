/**
 * API endpoint للتحقق من Google reCAPTCHA
 * تاريخ الإنشاء: 09-08-2025
 */

import { NextRequest, NextResponse } from 'next/server';
import recaptchaService from '../lib/recaptchaService';

export async function POST(request: NextRequest) {
  try {
    // الحصول على البيانات من الطلب
    const body = await request.json();
    const { token, action, remoteip } = body;

    // التحقق من وجود البيانات المطلوبة
    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'رمز التحقق مطلوب' 
        },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'نوع العملية مطلوب' 
        },
        { status: 400 }
      );
    }

    // الحصول على معلومات الطلب
    const userAgent = request.headers.get('user-agent') || '';
    const clientIP = remoteip || 
      request.headers.get('x-forwarded-for') || 
      request.headers.get('x-real-ip') || 
      'unknown';

    console.log('🔍 التحقق من reCAPTCHA:', {
      action,
      clientIP: clientIP.substring(0, 20) + '...',
      userAgent: userAgent.substring(0, 50) + '...'
    });

    // التحقق من صحة reCAPTCHA
    const result = await recaptchaService.verifyWithDetails(
      token,
      action,
      userAgent,
      clientIP
    );

    // إرجاع النتيجة
    if (result.success) {
      return NextResponse.json({
        success: true,
        score: result.score,
        action: result.action,
        message: result.message,
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          error_codes: result.error_codes,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('❌ خطأ في API التحقق من reCAPTCHA:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'حدث خطأ في الخادم',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  }
}

// دعم GET للاختبار
export async function GET() {
  return NextResponse.json({
    message: 'reCAPTCHA Verification API',
    status: 'active',
    timestamp: new Date().toISOString()
  });
}


