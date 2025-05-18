"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FiArrowRight, FiRefreshCw } from "react-icons/fi";
import { TbCurrencyDollar, TbCurrencyEuro, TbCurrencyPound, TbCurrencyRupee, TbCurrencyYen } from "react-icons/tb";

// Import Shadcn UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Dummy currency rates relative to USD
const RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 155.47,
  INR: 83.45,
};

// Currency icons mapping
const CURRENCY_ICONS = {
  USD: TbCurrencyDollar,
  EUR: TbCurrencyEuro,
  GBP: TbCurrencyPound,
  JPY: TbCurrencyYen,
  INR: TbCurrencyRupee,
};

export default function Home() {
  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState<keyof typeof RATES>("USD");
  const [toCurrency, setToCurrency] = useState<keyof typeof RATES>("EUR");
  const [result, setResult] = useState<number>(0);
  const [history, setHistory] = useState<Array<{
    id: string;
    amount: string;
    fromCurrency: keyof typeof RATES;
    toCurrency: keyof typeof RATES;
    result: number;
    timestamp: Date;
  }>>([]);

  // Convert currency whenever inputs change
  useEffect(() => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount)) {
      // Convert to USD first (if not already USD), then to target currency
      const amountInUSD = fromCurrency === "USD" ? numericAmount : numericAmount / RATES[fromCurrency];
      const convertedAmount = toCurrency === "USD" ? amountInUSD : amountInUSD * RATES[toCurrency];
      setResult(convertedAmount);
    } else {
      setResult(0);
    }
  }, [amount, fromCurrency, toCurrency]);

  // Handle currency swap
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-900 to-black p-6">
      <Card className="mx-auto w-full max-w-md rounded-xl bg-zinc-800/30 p-6 backdrop-blur-md border border-zinc-800 shadow-xl">
        <CardHeader className="mb-4 flex items-center justify-between p-0">
          <CardTitle className="text-2xl font-bold text-white">Currency Converter</CardTitle>
          <Image
            src="/vercel.svg"
            alt="Vercel Logo"
            width={24}
            height={24}
            className="dark:invert"
          />
        </CardHeader>
        
        <CardContent className="p-0 space-y-5">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="block text-sm font-medium text-zinc-400">
              Amount
            </Label>
            <Input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border-zinc-700 bg-zinc-800/50 text-white focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
          
          {/* Currency Selectors */}
          <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
            {/* From Currency */}
            <div className="space-y-2">
              <Label htmlFor="fromCurrency" className="block text-sm font-medium text-zinc-400">
                From
              </Label>
              <Select value={fromCurrency} onValueChange={(value) => setFromCurrency(value as keyof typeof RATES)}>
                <SelectTrigger className="w-full border-zinc-700 bg-zinc-800/50 text-white">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(RATES).map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Swap Button */}
            <Button
              onClick={handleSwapCurrencies}
              variant="ghost"
              size="icon"
              className="mt-5 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 hover:bg-blue-600 transition-colors duration-200"
            >
              <FiRefreshCw className="text-white" />
            </Button>
            
            {/* To Currency */}
            <div className="space-y-2">
              <Label htmlFor="toCurrency" className="block text-sm font-medium text-zinc-400">
                To
              </Label>
              <Select value={toCurrency} onValueChange={(value) => setToCurrency(value as keyof typeof RATES)}>
                <SelectTrigger className="w-full border-zinc-700 bg-zinc-800/50 text-white">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(RATES).map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Result */}
          <div className="mt-8 rounded-lg bg-zinc-900/60 p-4">
            <div className="flex items-center justify-between text-zinc-400">
              <div className="flex items-center gap-2">
                {fromCurrency && (() => {
                  const CurrencyIcon = CURRENCY_ICONS[fromCurrency];
                  return <CurrencyIcon className="h-5 w-5" />;
                })()}
                <span>{parseFloat(amount) ? parseFloat(amount).toFixed(2) : "0.00"} {fromCurrency}</span>
              </div>
              <FiArrowRight />
              <div className="flex items-center gap-2">
                {toCurrency && (() => {
                  const CurrencyIcon = CURRENCY_ICONS[toCurrency];
                  return <CurrencyIcon className="h-5 w-5" />;
                })()}
                <span className="font-medium text-white">{result.toFixed(2)} {toCurrency}</span>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-0 mt-4 justify-center flex-col">
          <div className="text-center text-xs text-zinc-500">
            <p>1 {fromCurrency} = {(RATES[toCurrency] / RATES[fromCurrency]).toFixed(4)} {toCurrency}</p>
            <p className="mt-1">Last updated: May 17, 2025</p>
          </div>
        </CardFooter>
      </Card>
      
      <footer className="mt-8 text-center text-xs text-zinc-500">
        <p>Rates are for demonstration purposes only</p>
        <p className="mt-1">Powered by Shadcn UI & Next.js</p>
      </footer>
    </div>
  );
}
