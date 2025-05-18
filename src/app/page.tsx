"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FiArrowRight, FiCheck, FiClock, FiRefreshCw } from "react-icons/fi";
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
  
  // Add conversion to history when convert button is clicked
  const addToHistory = () => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      setHistory(prev => [
        {
          id: Date.now().toString(),
          amount,
          fromCurrency,
          toCurrency,
          result,
          timestamp: new Date()
        },
        ...prev.slice(0, 9) // Keep only the 10 most recent conversions
      ]);
    }
  };

  // Handle currency swap
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-950 to-black p-6">
      <div className="flex items-center justify-center mb-8">
        <div className="bg-blue-600 p-3 rounded-full">
          <Image
            src="/globe.svg" 
            alt="Currency Converter Logo"
            width={32}
            height={32}
            className="invert"
          />
        </div>
        <h1 className="ml-3 text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          CurrencyHub
        </h1>
      </div>
      <div className="flex w-full max-w-5xl gap-6 flex-col lg:flex-row">
        {/* Main Converter Card */}
        <Card className="w-full lg:max-w-[60%] rounded-xl bg-zinc-900/70 p-6 backdrop-blur-md border border-zinc-800/30 shadow-2xl">
          <CardHeader className="mb-4 flex items-center justify-between p-0">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-full p-2">
                <FiRefreshCw className="text-white h-5 w-5" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Currency Converter
              </CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 space-y-6">
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="block text-sm font-medium text-zinc-300">
                Amount
              </Label>
              <Input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border-blue-900/30 bg-zinc-800/70 text-white focus:border-blue-500 focus:ring-blue-500/20 text-lg"
              />
            </div>
            
            {/* Currency Selectors */}
            <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-4">
              {/* From Currency */}
              <div className="space-y-2">
                <Label htmlFor="fromCurrency" className="block text-sm font-medium text-zinc-300">
                  From
                </Label>
                <Select value={fromCurrency} onValueChange={(value) => setFromCurrency(value as keyof typeof RATES)}>
                  <SelectTrigger className="w-full border-blue-900/30 bg-zinc-800/70 text-white hover:bg-zinc-800">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(RATES).map((currency) => (
                      <SelectItem key={currency} value={currency} className="flex items-center gap-2">
                        {(() => {
                          const CurrencyIcon = CURRENCY_ICONS[currency as keyof typeof RATES];
                          return <CurrencyIcon className="h-4 w-4 inline mr-1" />;
                        })()}
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
                className="mt-5 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105"
              >
                <FiRefreshCw className="text-white" />
              </Button>
              
              {/* To Currency */}
              <div className="space-y-2">
                <Label htmlFor="toCurrency" className="block text-sm font-medium text-zinc-300">
                  To
                </Label>
                <Select value={toCurrency} onValueChange={(value) => setToCurrency(value as keyof typeof RATES)}>
                  <SelectTrigger className="w-full border-blue-900/30 bg-zinc-800/70 text-white hover:bg-zinc-800">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(RATES).map((currency) => (
                      <SelectItem key={currency} value={currency} className="flex items-center gap-2">
                        {(() => {
                          const CurrencyIcon = CURRENCY_ICONS[currency as keyof typeof RATES];
                          return <CurrencyIcon className="h-4 w-4 inline mr-1" />;
                        })()}
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Result */}
            <div className="mt-8 rounded-xl bg-gradient-to-r from-blue-900/30 to-indigo-900/30 p-5 border border-blue-800/30">
              <div className="flex items-center justify-between text-zinc-200">
                <div className="flex items-center gap-2">
                  {fromCurrency && (() => {
                    const CurrencyIcon = CURRENCY_ICONS[fromCurrency];
                    return <CurrencyIcon className="h-6 w-6" />;
                  })()}
                  <span>{parseFloat(amount) ? parseFloat(amount).toFixed(2) : "0.00"} {fromCurrency}</span>
                </div>
                <div className="bg-blue-700/40 rounded-full p-1">
                  <FiArrowRight className="text-blue-300" />
                </div>
                <div className="flex items-center gap-2">
                  {toCurrency && (() => {
                    const CurrencyIcon = CURRENCY_ICONS[toCurrency];
                    return <CurrencyIcon className="h-6 w-6" />;
                  })()}
                  <span className="font-medium text-white text-lg">{result.toFixed(2)} {toCurrency}</span>
                </div>
              </div>
            </div>
            
            {/* Convert Button */}
            <Button 
              onClick={addToHistory} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl font-medium mt-2 transition-all hover:shadow-lg hover:shadow-blue-700/20"
            >
              Convert & Save
            </Button>
          </CardContent>
          
          <CardFooter className="p-0 mt-5 justify-center flex-col">
            <div className="text-center text-xs text-zinc-400">
              <p>1 {fromCurrency} = {(RATES[toCurrency] / RATES[fromCurrency]).toFixed(4)} {toCurrency}</p>
              <p className="mt-1">Last updated: May 18, 2025</p>
            </div>
          </CardFooter>
        </Card>
        
        {/* History Card */}
        <Card className="w-full lg:max-w-[40%] rounded-xl bg-zinc-900/70 p-6 backdrop-blur-md border border-zinc-800/30 shadow-2xl">
          <CardHeader className="mb-3 p-0">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-700 rounded-full p-2">
                <FiClock className="text-white h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Conversion History
              </CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 max-h-[400px] overflow-y-auto custom-scrollbar">
            {history.length === 0 ? (
              <div className="text-center py-10 text-zinc-500">
                <p>No conversion history yet</p>
                <p className="text-sm mt-2">Your conversions will appear here</p>
              </div>
            ) : (
              <div className="space-y-3 mt-2">
                {history.map(item => (
                  <div 
                    key={item.id} 
                    className="p-3 rounded-lg border border-zinc-800/50 bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-zinc-400 text-xs">
                        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="bg-blue-900/30 text-blue-300 text-xs py-0.5 px-2 rounded-full flex items-center gap-1">
                        <FiCheck size={10} />
                        Converted
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-300 text-sm">
                      <div className="flex items-center gap-1">
                        {(() => {
                          const CurrencyIcon = CURRENCY_ICONS[item.fromCurrency];
                          return <CurrencyIcon className="h-4 w-4" />;
                        })()}
                        <span>{parseFloat(item.amount).toFixed(2)} {item.fromCurrency}</span>
                      </div>
                      <FiArrowRight className="text-zinc-500 h-3 w-3" />
                      <div className="flex items-center gap-1">
                        {(() => {
                          const CurrencyIcon = CURRENCY_ICONS[item.toCurrency];
                          return <CurrencyIcon className="h-4 w-4" />;
                        })()}
                        <span>{item.result.toFixed(2)} {item.toCurrency}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <footer className="mt-8 text-center text-xs text-zinc-500">
        <p>Rates are for demonstration purposes only</p>
        <p className="mt-1">Updated: May 18, 2025 • Powered by Shadcn UI & Next.js</p>
      </footer>
    </div>
  );
}
