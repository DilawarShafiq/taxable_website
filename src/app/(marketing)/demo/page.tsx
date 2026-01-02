"use client";

import { useState, useCallback } from "react";
import { Upload, FileUp, Loader2, CheckCircle, AlertCircle, ArrowRight, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import Link from "next/link";

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

// Mock processing function - simulates AI processing
const mockProcessDocument = async (): Promise<ProcessingResult> => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return {
    transactions: [
      { date: "2026-01-02", description: "SALARY DEPOSIT", amount: 5000, type: "credit", category: "Income" },
      { date: "2026-01-03", description: "AMAZON.COM", amount: -89.99, type: "debit", category: "Shopping" },
      { date: "2026-01-04", description: "ELECTRICITY BILL", amount: -125.50, type: "debit", category: "Utilities" },
      { date: "2026-01-05", description: "GROCERY STORE", amount: -156.32, type: "debit", category: "Groceries" },
      { date: "2026-01-06", description: "GAS STATION", amount: -45.00, type: "debit", category: "Transport" },
      { date: "2026-01-07", description: "RESTAURANT", amount: -67.80, type: "debit", category: "Dining" },
      { date: "2026-01-08", description: "FREELANCE PAYMENT", amount: 1200, type: "credit", category: "Income" },
      { date: "2026-01-09", description: "NETFLIX", amount: -15.99, type: "debit", category: "Entertainment" },
    ],
    summary: {
      totalCredits: 6200,
      totalDebits: 500.60,
      netChange: 5699.40,
      transactionCount: 8,
    },
    categories: [
      { category: "Income", amount: 6200, percentage: 92.5 },
      { category: "Shopping", amount: 89.99, percentage: 1.3 },
      { category: "Utilities", amount: 125.50, percentage: 1.9 },
      { category: "Groceries", amount: 156.32, percentage: 2.3 },
      { category: "Transport", amount: 45.00, percentage: 0.7 },
      { category: "Dining", amount: 67.80, percentage: 1.0 },
      { category: "Entertainment", amount: 15.99, percentage: 0.3 },
    ],
  };
};

export default function DemoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "complete" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcess = async () => {
    if (!file) return;

    setStatus("uploading");
    setProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 30; i += 10) {
      await new Promise((r) => setTimeout(r, 200));
      setProgress(i);
    }

    setStatus("processing");

    // Simulate processing progress
    for (let i = 30; i <= 90; i += 15) {
      await new Promise((r) => setTimeout(r, 500));
      setProgress(i);
    }

    try {
      const data = await mockProcessDocument();
      setProgress(100);
      setResult(data);
      setStatus("complete");
    } catch {
      setStatus("error");
    }
  };

  const resetDemo = () => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setResult(null);
  };

  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">AI Demo</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Try Our AI Document Processing
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Upload a bank statement PDF and watch our AI instantly extract, categorize,
              and summarize your transactions. No signup required.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Secure Processing
              </span>
              <span className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-green-500" />
                Data Not Stored
              </span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Demo Area */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {status === "idle" && (
              <AnimatedSection>
                <Card>
                  <CardContent className="p-8">
                    <div
                      className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                        dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                      <h3 className="text-xl font-semibold mb-2">
                        {file ? file.name : "Drop your bank statement here"}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {file
                          ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                          : "PDF files up to 25MB supported"}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <label>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <Button variant="outline" asChild>
                            <span>Browse Files</span>
                          </Button>
                        </label>
                        {file && (
                          <Button onClick={handleProcess}>
                            Process Document
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      For demo purposes, any PDF will show sample results
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )}

            {(status === "uploading" || status === "processing") && (
              <AnimatedSection>
                <Card>
                  <CardContent className="p-12 text-center">
                    <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
                    <h3 className="text-xl font-semibold mb-2">
                      {status === "uploading" ? "Uploading..." : "AI Processing..."}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {status === "uploading"
                        ? "Securely uploading your document"
                        : "Extracting and categorizing transactions"}
                    </p>
                    <div className="w-full max-w-md mx-auto bg-muted rounded-full h-2 mb-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">{progress}%</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )}

            {status === "complete" && result && (
              <AnimatedSection>
                <div className="space-y-6">
                  {/* Success Header */}
                  <Card className="bg-green-500/10 border-green-500/30">
                    <CardContent className="p-6 flex items-center gap-4">
                      <CheckCircle className="h-10 w-10 text-green-500" />
                      <div>
                        <h3 className="text-xl font-semibold">Processing Complete!</h3>
                        <p className="text-muted-foreground">
                          Found {result.summary.transactionCount} transactions in your statement
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Summary Cards */}
                  <div className="grid sm:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Total Credits</p>
                        <p className="text-2xl font-bold text-green-500">
                          ${result.summary.totalCredits.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Total Debits</p>
                        <p className="text-2xl font-bold text-red-500">
                          ${result.summary.totalDebits.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Net Change</p>
                        <p className="text-2xl font-bold text-primary">
                          ${result.summary.netChange.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Transactions</p>
                        <p className="text-2xl font-bold">{result.summary.transactionCount}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Transactions Table */}
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-4">Extracted Transactions</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 px-2">Date</th>
                              <th className="text-left py-2 px-2">Description</th>
                              <th className="text-left py-2 px-2">Category</th>
                              <th className="text-right py-2 px-2">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.transactions.map((tx, i) => (
                              <tr key={i} className="border-b">
                                <td className="py-2 px-2">{tx.date}</td>
                                <td className="py-2 px-2">{tx.description}</td>
                                <td className="py-2 px-2">
                                  <Badge variant="secondary">{tx.category}</Badge>
                                </td>
                                <td className={`py-2 px-2 text-right font-medium ${
                                  tx.type === "credit" ? "text-green-500" : "text-red-500"
                                }`}>
                                  {tx.type === "credit" ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* CTA */}
                  <Card className="bg-primary/5">
                    <CardContent className="p-8 text-center">
                      <h4 className="text-xl font-semibold mb-2">
                        Ready for Full AI-Powered Accounting?
                      </h4>
                      <p className="text-muted-foreground mb-6">
                        Get unlimited document processing, tax calculations, and expert support.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contact">
                          <Button size="lg">
                            Get Started
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </Link>
                        <Button size="lg" variant="outline" onClick={resetDemo}>
                          Try Another Document
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </AnimatedSection>
            )}

            {status === "error" && (
              <AnimatedSection>
                <Card className="bg-red-500/10 border-red-500/30">
                  <CardContent className="p-12 text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold mb-2">Processing Failed</h3>
                    <p className="text-muted-foreground mb-6">
                      Something went wrong. Please try again.
                    </p>
                    <Button onClick={resetDemo}>Try Again</Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
