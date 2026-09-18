import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider, apiKey, model } = body;

    if (!provider) {
      return NextResponse.json({ success: false, error: "Vui lòng chọn nhà cung cấp AI" }, { status: 400 });
    }

    const key = apiKey || (provider === 'gemini' ? process.env.GEMINI_API_KEY : '');
    if (!key && provider !== 'gemini') {
      return NextResponse.json({
        success: false,
        error: `Vui lòng nhập API Key cho ${provider.toUpperCase()}`
      }, { status: 400 });
    }

    const startTime = Date.now();

    // Provider specific test
    if (provider === 'gemini') {
      const activeKey = key || process.env.GEMINI_API_KEY;
      if (!activeKey) {
        return NextResponse.json({
          success: false,
          error: "Chưa cấu hình GEMINI_API_KEY trong môi trường hoặc cài đặt"
        }, { status: 400 });
      }
      const ai = new GoogleGenAI({ apiKey: activeKey });
      const response = await ai.models.generateContent({
        model: model || "gemini-2.5-flash",
        contents: "Xin chào, phản hồi ngắn gọn 1 câu rằng hệ thống AI Bê Tông An Gia Bình sẵn sàng hoạt động.",
      });
      const responseTime = Date.now() - startTime;
      return NextResponse.json({
        success: true,
        provider: 'gemini',
        model: model || "gemini-2.5-flash",
        responseTime: `${responseTime}ms`,
        sampleResponse: response.text || "Kết nối Gemini API thành công!"
      });
    }

    if (provider === 'openai') {
      // Direct call to OpenAI completions
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${key}`
        },
        body: JSON.stringify({
          model: model || "gpt-4o-mini",
          messages: [{ role: "user", content: "Chào bạn, hãy phản hồi: OpenAI sẵn sàng." }],
          max_tokens: 30
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || `Lỗi từ OpenAI API (${res.status})`);
      }
      const responseTime = Date.now() - startTime;
      return NextResponse.json({
        success: true,
        provider: 'openai',
        model: model || "gpt-4o-mini",
        responseTime: `${responseTime}ms`,
        sampleResponse: data?.choices?.[0]?.message?.content || "Kết nối OpenAI thành công!"
      });
    }

    if (provider === 'grok') {
      // xAI Grok API endpoint
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${key}`
        },
        body: JSON.stringify({
          model: model || "grok-beta",
          messages: [{ role: "user", content: "Chào bạn, hãy phản hồi: Grok sẵn sàng." }],
          max_tokens: 30
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || `Lỗi từ Grok xAI API (${res.status})`);
      }
      const responseTime = Date.now() - startTime;
      return NextResponse.json({
        success: true,
        provider: 'grok',
        model: model || "grok-beta",
        responseTime: `${responseTime}ms`,
        sampleResponse: data?.choices?.[0]?.message?.content || "Kết nối Grok thành công!"
      });
    }

    if (provider === 'claude') {
      // Anthropic Claude
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: model || "claude-3-5-sonnet-20241022",
          messages: [{ role: "user", content: "Chào bạn, hãy phản hồi: Claude sẵn sàng." }],
          max_tokens: 30
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || `Lỗi từ Anthropic Claude API (${res.status})`);
      }
      const responseTime = Date.now() - startTime;
      return NextResponse.json({
        success: true,
        provider: 'claude',
        model: model || "claude-3-5-sonnet-20241022",
        responseTime: `${responseTime}ms`,
        sampleResponse: data?.content?.[0]?.text || "Kết nối Claude thành công!"
      });
    }

    if (provider === 'deepseek') {
      // DeepSeek API
      const res = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${key}`
        },
        body: JSON.stringify({
          model: model || "deepseek-chat",
          messages: [{ role: "user", content: "Chào bạn, hãy phản hồi: DeepSeek sẵn sàng." }],
          max_tokens: 30
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || `Lỗi từ DeepSeek API (${res.status})`);
      }
      const responseTime = Date.now() - startTime;
      return NextResponse.json({
        success: true,
        provider: 'deepseek',
        model: model || "deepseek-chat",
        responseTime: `${responseTime}ms`,
        sampleResponse: data?.choices?.[0]?.message?.content || "Kết nối DeepSeek thành công!"
      });
    }

    return NextResponse.json({ success: true, message: `Cấu hình ${provider} hợp lệ.` });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || "Kiểm tra kết nối thất bại"
    }, { status: 500 });
  }
}
