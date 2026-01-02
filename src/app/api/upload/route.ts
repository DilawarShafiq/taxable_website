import { NextRequest, NextResponse } from "next/server";

interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
  category: string;
}

interface ProcessingResult {
  transactions: Transaction[];
  summary: {
    totalCredits: number;
    totalDebits: number;
    netChange: number;
    transactionCount: number;
  };
  categories: { category: string; amount: number; percentage: number }[];
}

// Mock AI processing - in production, integrate with actual AI service
async function processDocument(): Promise<ProcessingResult> {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Generate mock transactions with realistic data
  const transactions: Transaction[] = [
    { date: "2026-01-02", description: "SALARY DEPOSIT - EMPLOYER", amount: 5000, type: "credit", category: "Income" },
    { date: "2026-01-03", description: "AMAZON.COM PURCHASE", amount: -89.99, type: "debit", category: "Shopping" },
    { date: "2026-01-04", description: "ELECTRICITY BILL PAYMENT", amount: -125.50, type: "debit", category: "Utilities" },
    { date: "2026-01-05", description: "GROCERY STORE - WALMART", amount: -156.32, type: "debit", category: "Groceries" },
    { date: "2026-01-06", description: "GAS STATION - SHELL", amount: -45.00, type: "debit", category: "Transport" },
    { date: "2026-01-07", description: "RESTAURANT - DINNER", amount: -67.80, type: "debit", category: "Dining" },
    { date: "2026-01-08", description: "FREELANCE PAYMENT RECEIVED", amount: 1200, type: "credit", category: "Income" },
    { date: "2026-01-09", description: "NETFLIX SUBSCRIPTION", amount: -15.99, type: "debit", category: "Entertainment" },
    { date: "2026-01-10", description: "PHONE BILL - VERIZON", amount: -85.00, type: "debit", category: "Utilities" },
    { date: "2026-01-11", description: "GYM MEMBERSHIP", amount: -49.99, type: "debit", category: "Health" },
    { date: "2026-01-12", description: "COFFEE SHOP", amount: -12.50, type: "debit", category: "Dining" },
    { date: "2026-01-13", description: "DIVIDEND PAYMENT", amount: 150, type: "credit", category: "Investment" },
  ];

  // Calculate summary
  const totalCredits = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = Math.abs(
    transactions
      .filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  // Calculate categories
  const categoryMap = new Map<string, number>();
  transactions.forEach((t) => {
    const amount = Math.abs(t.amount);
    categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + amount);
  });

  const totalAmount = totalCredits + totalDebits;
  const categories = Array.from(categoryMap.entries()).map(([category, amount]) => ({
    category,
    amount,
    percentage: Math.round((amount / totalAmount) * 1000) / 10,
  }));

  return {
    transactions,
    summary: {
      totalCredits,
      totalDebits,
      netChange: totalCredits - totalDebits,
      transactionCount: transactions.length,
    },
    categories: categories.sort((a, b) => b.amount - a.amount),
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: true, message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: true, message: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    // Validate file size (max 25MB)
    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: true, message: "File size exceeds 25MB limit" },
        { status: 400 }
      );
    }

    // Process the document
    const result = await processDocument();

    return NextResponse.json({
      success: true,
      filename: file.name,
      size: file.size,
      result,
      processedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: true,
        message: "An error occurred processing your document.",
      },
      { status: 500 }
    );
  }
}
