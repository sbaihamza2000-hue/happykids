import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !message) {
      return NextResponse.json(
        { error: 'Le nom et le message sont requis.' },
        { status: 400 }
      );
    }

    // In a production app, you would send an email or save to database here

    return NextResponse.json({
      success: true,
      message: 'Votre message a été envoyé avec succès ! Nous vous répondrons bientôt.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
