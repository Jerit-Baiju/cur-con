'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiArrowRight, FiCheck, FiClock, FiRefreshCw, FiX } from 'react-icons/fi';
import { MdCurrencyBitcoin } from "react-icons/md";
import { TbCurrencyDollar, TbCurrencyEuro, TbCurrencyPound, TbCurrencyRupee, TbCurrencyYen } from 'react-icons/tb';

// Import Shadcn UI components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<keyof typeof RATES>('USD');
  const [toCurrency, setToCurrency] = useState<keyof typeof RATES>('EUR');
  const [result, setResult] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [history, setHistory] = useState<
    Array<{
      id: string;
      amount: string;
      fromCurrency: keyof typeof RATES;
      toCurrency: keyof typeof RATES;
      result: number;
      timestamp: Date;
    }>
  >([]);

  // Convert currency whenever inputs change
  useEffect(() => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount)) {
      // Convert to USD first (if not already USD), then to target currency
      const amountInUSD = fromCurrency === 'USD' ? numericAmount : numericAmount / RATES[fromCurrency];
      const convertedAmount = toCurrency === 'USD' ? amountInUSD : amountInUSD * RATES[toCurrency];
      setResult(convertedAmount);
    } else {
      setResult(0);
    }
  }, [amount, fromCurrency, toCurrency]);

  // Add conversion to history when convert button is clicked
  const addToHistory = () => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      setHistory((prev) => [
        {
          id: Date.now().toString(),
          amount,
          fromCurrency,
          toCurrency,
          result,
          timestamp: new Date(),
        },
        ...prev.slice(0, 9), // Keep only the 10 most recent conversions
      ]);
    }
  };

  // Handle currency swap
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Remove a specific history item by its ID
  const removeHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter(item => item.id !== id));
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-950 to-black p-6 font-mono'>
      <div className='flex items-center justify-center mb-8'>
        <Tooltip>
          <TooltipTrigger className="flex items-center">
            <div className='bg-blue-600 p-3 rounded-full'>
              <MdCurrencyBitcoin className="text-white w-8 h-8" />
            </div>
            <h1 className='ml-3 text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent font-mono'>
              cur-con
            </h1>
          </TooltipTrigger>
          <TooltipContent className="bg-zinc-800 text-white">
            The modern currency converter
          </TooltipContent>
        </Tooltip>
      </div>
      <div className={`flex w-full max-w-5xl gap-6 flex-col lg:flex-row ${history.length === 0 ? 'justify-center' : ''}`}>
        {/* Main Converter Card */}
        <Card className={`w-full ${history.length === 0 ? 'lg:max-w-[650px]' : 'lg:max-w-[60%]'} rounded-xl bg-zinc-900/70 p-6 backdrop-blur-md border border-zinc-800/30 shadow-2xl`}>
          <CardHeader className='mb-4 flex items-center justify-between p-0'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <CardTitle className='text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'>
                  Currency Converter
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className='p-0 space-y-6'>
            {/* Amount Input */}
            <div className='space-y-2'>
              <div className="flex items-center justify-between">
                <Label htmlFor='amount' className='block text-sm font-medium text-zinc-300'>
                  Amount
                </Label>
                {amount && isNaN(parseFloat(amount)) && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="destructive" className="opacity-90">Invalid number</Badge>
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-800 text-red-300">
                      Please enter a valid number
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <Input
                type='number'
                id='amount'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full border-blue-900/30 bg-zinc-800/70 text-white focus:border-blue-500 focus:ring-blue-500/20 text-lg ${
                  amount && isNaN(parseFloat(amount)) ? 'border-red-500/50' : ''
                }`}
              />
            </div>

            {/* Currency Selectors */}
            <div className='grid grid-cols-[1fr,auto,1fr] items-center gap-4'>
              {/* From Currency */}
              <div className='space-y-2'>
                <Label htmlFor='fromCurrency' className='block text-sm font-medium text-zinc-300'>
                  From
                </Label>
                <Select value={fromCurrency} onValueChange={(value) => setFromCurrency(value as keyof typeof RATES)}>
                  <SelectTrigger className='w-full border-blue-900/30 bg-zinc-800/70 text-white hover:bg-zinc-800'>
                    <SelectValue placeholder='Select currency' />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-200">
                    {Object.keys(RATES).map((currency) => (
                      <SelectItem 
                        key={currency} 
                        value={currency} 
                        className='flex items-center gap-2 data-[highlighted]:bg-blue-700/30 data-[highlighted]:text-zinc-100'
                      >
                        {(() => {
                          const CurrencyIcon = CURRENCY_ICONS[currency as keyof typeof RATES];
                          return <CurrencyIcon className='h-4 w-4 inline mr-1' />;
                        })()}
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* To Currency */}
              <div className='space-y-2'>
                <Label htmlFor='toCurrency' className='block text-sm font-medium text-zinc-300'>
                  To
                </Label>
                <Select value={toCurrency} onValueChange={(value) => setToCurrency(value as keyof typeof RATES)}>
                  <SelectTrigger className='w-full border-blue-900/30 bg-zinc-800/70 text-white hover:bg-zinc-800'>
                    <SelectValue placeholder='Select currency' />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-200">
                    {Object.keys(RATES).map((currency) => (
                      <SelectItem 
                        key={currency} 
                        value={currency} 
                        className='flex items-center gap-2 data-[highlighted]:bg-blue-700/30 data-[highlighted]:text-zinc-100'
                      >
                        {(() => {
                          const CurrencyIcon = CURRENCY_ICONS[currency as keyof typeof RATES];
                          return <CurrencyIcon className='h-4 w-4 inline mr-1' />;
                        })()}
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Result */}
            <div className='mt-8 rounded-xl bg-gradient-to-r from-blue-900/30 to-indigo-900/30 p-5 border border-blue-800/30'>
              <div className='space-y-3'>
                <div className='flex items-center justify-between text-zinc-200'>
                  <div className='flex items-center gap-2'>
                    {fromCurrency &&
                      (() => {
                        const CurrencyIcon = CURRENCY_ICONS[fromCurrency];
                        return <CurrencyIcon className='h-6 w-6' />;
                      })()}
                    <span>
                      {parseFloat(amount) ? parseFloat(amount).toFixed(2) : '0.00'} {fromCurrency}
                    </span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleSwapCurrencies}
                        variant='ghost'
                        size='icon'
                        className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-700/40 hover:bg-blue-600 transition-all duration-200'>
                        <FiRefreshCw className='text-blue-300 hover:text-white' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-800 text-white">
                      Swap currencies
                    </TooltipContent>
                  </Tooltip>
                  <div className='flex items-center gap-2'>
                    {toCurrency &&
                      (() => {
                        const CurrencyIcon = CURRENCY_ICONS[toCurrency];
                        return <CurrencyIcon className='h-6 w-6' />;
                      })()}
                    <span className='font-medium text-white text-lg'>
                      {result.toFixed(2)} {toCurrency}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Save to History button */}
            <div className="mt-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Button
                      onClick={addToHistory}
                      disabled={isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}
                      className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 h-[56px] rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700 transition-all duration-200 hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-blue-600/20'>
                      <motion.div
                        initial={{ rotate: 0 }}
                        whileTap={{ rotate: [0, 15, 0, -15, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <FiCheck className="mr-2 h-5 w-5" />
                      </motion.div>
                      Save to History
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-800 text-white">
                  {isNaN(parseFloat(amount)) || parseFloat(amount) <= 0
                    ? "Please enter a valid positive amount"
                    : "Save this conversion to history"}
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>

          <CardFooter className='p-0 mt-5 justify-center flex-col'>
            <div className='text-center text-xs text-zinc-400 space-y-2'>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/20">
                  <span className="font-mono">
                    1 {fromCurrency} = {(RATES[toCurrency] / RATES[fromCurrency]).toFixed(4)} {toCurrency}
                  </span>
                </Badge>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* History Card - Only Show When History Exists */}
        <AnimatePresence>
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 50, width: 0 }}
              animate={{ opacity: 1, x: 0, width: "100%" }}
              exit={{ opacity: 0, x: 50, width: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full lg:max-w-[40%]"
            >
              <Card className='w-full rounded-xl bg-zinc-900/70 p-6 backdrop-blur-md border border-zinc-800/30 shadow-2xl'>
                <CardHeader className='mb-3 p-0'>
                  <div className='flex items-center gap-3'>
                    <motion.div 
                      initial={{ rotate: -90, scale: 0.5 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className='bg-indigo-700 rounded-full p-2'
                    >
                      <FiClock className='text-white h-5 w-5' />
                    </motion.div>
                    <div>
                      <CardTitle className='text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent'>
                        Conversion History
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className='p-0 max-h-[400px] overflow-y-auto custom-scrollbar'>
                  <div className='space-y-3 mt-2'>
                    <AnimatePresence>
                      {history.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: -20, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: 20, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className='p-3 rounded-lg border border-zinc-800/50 bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors relative group'
                        >
                          <div className='flex justify-between items-center mb-1'>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className='text-zinc-400 text-xs cursor-help'>
                                  {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="bg-zinc-800 text-white">
                                {item.timestamp.toLocaleDateString()} {item.timestamp.toLocaleTimeString()}
                              </TooltipContent>
                            </Tooltip>
                            
                            {/* Delete button - visible on hover */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeHistoryItem(item.id);
                                  }}
                                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/40"
                                  aria-label="Remove this history item"
                                >
                                  <FiX className="h-3 w-3 text-red-300 hover:text-white" />
                                </motion.button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-zinc-800 text-white">
                                Remove this item
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <div className='flex items-center justify-between text-zinc-300 text-sm'>
                            <div className='flex items-center gap-1'>
                              {(() => {
                                const CurrencyIcon = CURRENCY_ICONS[item.fromCurrency];
                                return <CurrencyIcon className='h-4 w-4' />;
                              })()}
                              <span>
                                {parseFloat(item.amount).toFixed(2)} {item.fromCurrency}
                              </span>
                            </div>
                            <FiArrowRight className='text-zinc-500 h-3 w-3' />
                            <div className='flex items-center gap-1'>
                              {(() => {
                                const CurrencyIcon = CURRENCY_ICONS[item.toCurrency];
                                return <CurrencyIcon className='h-4 w-4' />;
                              })()}
                              <span>
                                {item.result.toFixed(2)} {item.toCurrency}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
                <CardFooter className="p-0 mt-4 flex justify-center">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                      >
                        Clear History
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-900 border border-zinc-800 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Clear History</DialogTitle>
                        <DialogDescription className="text-zinc-300">
                          Are you sure you want to clear all conversion history? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="mt-4 gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setDialogOpen(false)}
                          className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => {
                            setHistory([]);
                            setDialogOpen(false);
                          }}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Clear All
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className='mt-8 text-center text-xs text-zinc-500'>
        <p>Rates are for demonstration purposes only</p>
        <p className='mt-1'>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">Updated: May 18, 2025 • Powered by <Badge variant="outline" className="border-blue-700/20 text-blue-400">cur-con</Badge></span>
            </TooltipTrigger>
            <TooltipContent className="bg-zinc-800 text-white">
              Currency converter with real-time rates
            </TooltipContent>
          </Tooltip>
        </p>
      </footer>
    </div>
  );
}
