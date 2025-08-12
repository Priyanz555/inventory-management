import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Get file details
    const fileDetails = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    };

    // Read file content (first 1000 characters for debugging)
    const fileContent = await file.text();
    const preview = fileContent.substring(0, 1000);
    const totalLines = fileContent.split('\n').length;

    return NextResponse.json({
      success: true,
      fileDetails,
      contentPreview: preview,
      totalLines,
      fileSize: fileContent.length
    });
  } catch (error) {
    console.error('Test upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process test upload', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 