import { NextRequest, NextResponse } from 'next/server';
import { getInitialPosts, getMorePosts } from '@/actions/blog';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startYearMonth = searchParams.get('startYearMonth');

    let result;
    if (startYearMonth) {
      // startYearMonth が指定されている場合、その前月から取得
      result = await getMorePosts(startYearMonth);
    } else {
      // 初回: 現在の年月から取得
      result = await getInitialPosts();
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
