import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for drafts (in production, this would be a database)
const draftStorage = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const draftData = await request.json();
    
    // Validate required fields
    if (!draftData.sessionId || !draftData.items) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId and items' },
        { status: 400 }
      );
    }

    // Store the draft
    draftStorage.set(draftData.sessionId, {
      ...draftData,
      savedAt: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Draft saved successfully',
      savedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving draft:', error);
    return NextResponse.json(
      { error: 'Failed to save draft' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const draft = draftStorage.get(sessionId);
    
    if (!draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(draft);
  } catch (error) {
    console.error('Error retrieving draft:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve draft' },
      { status: 500 }
    );
  }
} 