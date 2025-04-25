// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/Context";
import userManagerAbi from "../../abis/UserManager.json";
import {
  Wallet,
  Shield,
  Lock,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ExternalLink,
  Database,
  Key,
  FileText,
  RefreshCw,
} from "lucide-react";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";

const userManagerContract = import.meta.env.VITE_USER_MANAGER_ADDRESS;

export default function Auth() {
  const [address, setAddress] = useState(null);
  const [, setLoading] = useState(false);
  const [authStep, setAuthStep] = useState(0);
  const [error, setError] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const { user, setUser, showNotification } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {}, []);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    } else {
      return;
    }
  }, [user, navigate]);

  const connectWallet = async () => {
    setError(null);
    if (!window.ethereum) return setError("Install MetaMask");

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const walletAddress = accounts[0];

      setAuthStep(1); // Step 1: Wallet connected

      const provider = new Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const userManager = new ethers.Contract(
        userManagerContract,
        userManagerAbi.abi,
        signer
      );
      const isAlreadyRegistered = await userManager.isRegistered(walletAddress);
      console.log("isRegistered:", isAlreadyRegistered);

      let tx;
      if (isAlreadyRegistered) {
        showNotification("Already registered on-chain");
      } else {
        try {
          // Send the transaction
          const tx = await userManager.registerUser();

          // Ensure tx is a valid transaction object
          if (!tx || typeof tx.wait !== "function") {
            throw new Error(
              "Transaction object is not valid or wait function is missing"
            );
          }

          // Wait for the transaction to be confirmed
          const receipt = await tx.wait(1); // Wait for 1 confirmation

          // Log and check the receipt
          console.log("Transaction receipt:", receipt);

          if (receipt.status === 1) {
            // Success case
            showNotification("User registered successfully on-chain");
          } else {
            // Failure case
            showNotification("Transaction failed on-chain");
          }
        } catch (err) {
          console.error("Error during registration:", err);
          showNotification("Registration failed. Please try again.");
        }
      }

      console.log(6);
      setAuthStep(2);
      setAddress(walletAddress);
      setUser({ address: walletAddress });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Connection denied or registration failed.");
      setAuthStep(0);
      setLoading(false);
    }
  };
  const resetConnection = () => {
    setAuthStep(0);
    setError(null);
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              EtherStore
            </span>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onClick={() => navigate("/")}
            className="px-5 py-2 rounded-full border border-gray-700 text-white font-medium hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Home
          </motion.button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="min-h-[60vh] flex flex-col items-center justify-center text-center relative">
            <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 to-transparent pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto z-10"
            >
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                  Secure Authentication
                </span>
              </h1>

              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Connect your Ethereum wallet to access our decentralized storage
                platform. Your wallet serves as your secure, private key to
                unlock your files.
              </p>

              {/* Wallet Connection Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
                  <div className="p-6 md:p-8">
                    {/* Authentication Steps */}
                    <AnimatePresence mode="wait">
                      {authStep === 0 && (
                        <motion.div
                          key="connect"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col items-center"
                        >
                          <h2 className="text-2xl font-bold mb-6">
                            Connect Your Wallet
                          </h2>

                          <div className="grid grid-cols-1  w-full max-w-2xl mb-8">
                            <WalletOption
                              name="Connect Wallet"
                              icon={
                                <img
                                  src="/metamask.png"
                                  alt="MetaMask"
                                  className="w-8 h-8"
                                />
                              }
                              onClick={() => connectWallet("metamask")}
                            />
                            {/* <WalletOption
                              name="WalletConnect"
                              icon={<img src="/walletconnect-logo.svg" alt="WalletConnect" className="w-8 h-8" />}
                              active={activeWallet === "walletconnect"}
                              onClick={() => connectWallet("walletconnect")}
                              comingSoon
                            />
                            <WalletOption
                              name="Coinbase Wallet"
                              icon={<img src="/coinbase-logo.svg" alt="Coinbase Wallet" className="w-8 h-8" />}
                              active={activeWallet === "coinbase"}
                              onClick={() => connectWallet("coinbase")}
                              comingSoon
                            /> */}
                          </div>

                          {error && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-2 text-red-400 mb-6 p-3 bg-red-500/10 rounded-lg"
                            >
                              <AlertCircle className="w-5 h-5" />
                              <span>{error}</span>
                            </motion.div>
                          )}

                          <p className="text-gray-400 text-sm mt-4">
                            By connecting, you agree to our{" "}
                            <a
                              href="/terms"
                              className="text-blue-400 hover:underline"
                            >
                              Terms of Service
                            </a>{" "}
                            and{" "}
                            <a
                              href="/privacy"
                              className="text-blue-400 hover:underline"
                            >
                              Privacy Policy
                            </a>
                          </p>
                        </motion.div>
                      )}

                      {authStep > 0 && authStep < 5 && (
                        <motion.div
                          key="authenticating"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col items-center"
                        >
                          <h2 className="text-2xl font-bold mb-8">
                            Authentication in Progress
                          </h2>

                          <div className="w-full max-w-md">
                            <AuthenticationStep
                              step={1}
                              title="Connecting to Wallet"
                              description="Establishing connection to your Ethereum wallet"
                              status={
                                authStep > 1
                                  ? "completed"
                                  : authStep === 1
                                  ? "active"
                                  : "pending"
                              }
                            />
                            <AuthenticationStep
                              step={2}
                              title="Registering User"
                              description="Storing address of the user on a smart contract for future authentication"
                              status={
                                authStep > 2
                                  ? "completed"
                                  : authStep === 2
                                  ? "active"
                                  : "pending"
                              }
                            />
                          </div>

                          {error && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-2 text-red-400 mt-8 p-3 bg-red-500/10 rounded-lg"
                            >
                              <AlertCircle className="w-5 h-5" />
                              <span>{error}</span>
                            </motion.div>
                          )}

                          {error && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={resetConnection}
                              className="mt-6 px-6 py-3 bg-transparent border border-gray-700 rounded-full text-white font-medium hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
                            >
                              <RefreshCw className="w-4 h-4" />
                              Try Again
                            </motion.button>
                          )}
                        </motion.div>
                      )}

                      {authStep === 5 && (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col items-center py-8"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 200,
                              damping: 10,
                            }}
                            className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
                          >
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                          </motion.div>

                          <h2 className="text-2xl font-bold mb-2">
                            Authentication Successful!
                          </h2>
                          <p className="text-gray-400 mb-6">
                            Redirecting you to the dashboard...
                          </p>

                          <div className="flex items-center gap-2 text-gray-400 bg-gray-800/50 rounded-full px-4 py-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm font-medium">
                              Connected:{" "}
                              {address &&
                                `${address.substring(
                                  0,
                                  6
                                )}...${address.substring(address.length - 4)}`}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </section>

          {/* How It Works Section */}
          <section className="py-20 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                  How Wallet Authentication Works
                </h2>
                <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
                  Our secure, non-custodial authentication process keeps you in
                  control
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8 relative">
                {/* Connection line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 transform -translate-y-1/2 hidden md:block"></div>

                <AuthCard
                  number="01"
                  title="Connect Wallet"
                  description="Link your Ethereum wallet to our platform without sharing your private keys."
                  icon={<Wallet className="w-8 h-8 text-purple-400" />}
                />
                <AuthCard
                  number="02"
                  title="Sign Message"
                  description="Cryptographically prove ownership of your wallet by signing a unique message."
                  icon={<Key className="w-8 h-8 text-blue-400" />}
                />
                <AuthCard
                  number="03"
                  title="Access Granted"
                  description="Once verified, you'll have secure access to your decentralized storage."
                  icon={<Shield className="w-8 h-8 text-purple-400" />}
                />
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-black to-gray-900 rounded-3xl">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                  Benefits of Wallet-Based Authentication
                </h2>
                <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
                  Why we use blockchain technology for secure access
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                <BenefitCard
                  title="No Password Required"
                  description="Forget about creating and remembering complex passwords. Your wallet is your secure key to access."
                  icon={<Key className="w-10 h-10 text-purple-400" />}
                />
                <BenefitCard
                  title="Enhanced Security"
                  description="Cryptographic signatures provide military-grade security that traditional password systems can't match."
                  icon={<Shield className="w-10 h-10 text-blue-400" />}
                />
                <BenefitCard
                  title="Full Ownership"
                  description="We never take custody of your private keys. You maintain complete control of your identity and data."
                  icon={<Lock className="w-10 h-10 text-purple-400" />}
                />
                <BenefitCard
                  title="Seamless Experience"
                  description="One-click access to your files across all devices without repetitive logins or session timeouts."
                  icon={<FileText className="w-10 h-10 text-blue-400" />}
                />
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                  Frequently Asked Questions
                </h2>
                <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
                  Common questions about wallet authentication
                </p>
              </motion.div>

              <div className="space-y-4">
                <FaqItem
                  question="What is a crypto wallet?"
                  answer="A crypto wallet is a digital tool that allows you to store, send, and receive cryptocurrencies. It also manages your private keys, which prove your ownership of digital assets and enable you to sign transactions on the blockchain."
                  isOpen={activeFaq === 0}
                  onClick={() => setActiveFaq(activeFaq === 0 ? null : 0)}
                />
                <FaqItem
                  question="Is it safe to connect my wallet?"
                  answer="Yes, connecting your wallet to our platform is secure. We use a standard signing method that never requires access to your private keys or funds. The signature only proves you own the wallet address without giving us any control over your assets."
                  isOpen={activeFaq === 1}
                  onClick={() => setActiveFaq(activeFaq === 1 ? null : 1)}
                />
                <FaqItem
                  question="What if I don't have a wallet?"
                  answer="If you don't have a crypto wallet yet, we recommend installing MetaMask, which is a user-friendly browser extension wallet. Visit metamask.io to download and set up your wallet in minutes. No cryptocurrency purchase is required to use our service."
                  isOpen={activeFaq === 2}
                  onClick={() => setActiveFaq(activeFaq === 2 ? null : 2)}
                />
                <FaqItem
                  question="Can I use any Ethereum wallet?"
                  answer="Yes, you can use any Ethereum-compatible wallet that supports message signing. This includes popular options like MetaMask, WalletConnect, Coinbase Wallet, and hardware wallets like Ledger or Trezor (when connected through compatible interfaces)."
                  isOpen={activeFaq === 3}
                  onClick={() => setActiveFaq(activeFaq === 3 ? null : 3)}
                />
                <FaqItem
                  question="What happens if I lose access to my wallet?"
                  answer="If you lose access to your wallet, you'll need to use your wallet's recovery phrase to restore it. We recommend adding a backup wallet to your account once you're logged in. This provides an alternative way to access your files if your primary wallet becomes unavailable."
                  isOpen={activeFaq === 4}
                  onClick={() => setActiveFaq(activeFaq === 4 ? null : 4)}
                />
              </div>
            </div>
          </section>

          {/* Need Help Section */}
          <section className="py-16 px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800 shadow-xl text-center"
            >
              <h2 className="text-2xl font-bold mb-4">
                Need Help Getting Started?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                If you're new to blockchain technology or having trouble
                connecting your wallet, our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  href="/support"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white font-semibold shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Contact Support
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  href="/guides/wallet-setup"
                  className="px-6 py-3 bg-transparent border border-gray-700 rounded-full text-white font-semibold hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  View Wallet Setup Guide
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-8 border-t border-gray-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
              <Database className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              EtherStore
            </span>
          </div>

          <div className="flex gap-6">
            <a
              href="/privacy"
              className="text-gray-500 hover:text-gray-300 text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-gray-500 hover:text-gray-300 text-sm"
            >
              Terms of Service
            </a>
            <a
              href="/support"
              className="text-gray-500 hover:text-gray-300 text-sm"
            >
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Reusable Components

const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-purple-500/20"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            opacity: Math.random() * 0.5 + 0.3,
          }}
          animate={{
            x: [
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
            ],
            y: [
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
            ],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

const WalletOption = ({ name, icon, active, onClick, comingSoon = false }) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    disabled={comingSoon}
    className={`relative p-4 rounded-xl border ${
      active
        ? "border-purple-500 bg-purple-500/10"
        : "border-gray-700 bg-gray-800/50"
    } flex flex-col items-center gap-3 transition-all duration-300 ${
      comingSoon
        ? "opacity-60 cursor-not-allowed"
        : "hover:border-purple-500/50"
    }`}
  >
    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
      {icon}
    </div>
    <span className="font-medium">{name}</span>
    {comingSoon && (
      <div className="absolute top-2 right-2 bg-gray-700 text-xs px-2 py-1 rounded-full">
        Soon
      </div>
    )}
  </motion.button>
);

const AuthenticationStep = ({ step, title, description, status }) => (
  <div className="flex items-start gap-4 mb-6">
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
        status === "completed"
          ? "bg-green-500/20"
          : status === "active"
          ? "bg-blue-500/20"
          : "bg-gray-700"
      }`}
    >
      {status === "completed" ? (
        <CheckCircle2 className="w-5 h-5 text-green-500" />
      ) : status === "active" ? (
        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      ) : (
        <span className="text-xs text-gray-400">{step}</span>
      )}
    </div>
    <div>
      <h4
        className={`font-medium ${
          status === "completed"
            ? "text-green-400"
            : status === "active"
            ? "text-blue-400"
            : "text-gray-400"
        }`}
      >
        {title}
      </h4>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </div>
);

const AuthCard = ({ number, title, description, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true, margin: "-100px" }}
    className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800 shadow-xl relative"
  >
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold z-10">
      {number}
    </div>
    <div className="pt-4 text-center">
      <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  </motion.div>
);

const BenefitCard = ({ title, description, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true, margin: "-100px" }}
    className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-800 shadow-lg hover:shadow-purple-500/5 transition-all duration-300"
  >
    <div className="flex gap-5">
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  </motion.div>
);

const FaqItem = ({ question, answer, isOpen, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true, margin: "-100px" }}
    className="border border-gray-800 rounded-xl overflow-hidden"
  >
    <button
      onClick={onClick}
      className="flex justify-between items-center w-full p-5 text-left bg-gradient-to-br from-gray-900 to-black hover:from-gray-800 hover:to-black transition-colors"
    >
      <h3 className="text-base font-semibold">{question}</h3>
      <ChevronDown
        className={`w-5 h-5 transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="p-5 bg-black/50 border-t border-gray-800 text-gray-300">
            {answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);
