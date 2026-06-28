import { useState } from "react";
import { toast } from "sonner";

import {
  HiOutlinePaperAirplane,
  HiOutlineCurrencyDollar,
  HiOutlineShieldCheck,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import {
  TestSmsResponse,
  useGetSmsBalanceQuery,
  useSendTestSmsMutation,
} from "@/services/smsApi";
import { MdOutlineRefresh } from "react-icons/md";
import { Input, Textarea } from "@/components/form";
import { Button } from "@/components/buttons/Button";
import { useNavigate } from "react-router-dom";

const AdminSmsPage = () => {
  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    refetch: refetchBalance,
  } = useGetSmsBalanceQuery();
  const [sendTestSms, { isLoading: isSending }] = useSendTestSmsMutation();

  const navigate = useNavigate();

  // console.log({ balanceData });
  const [testPhone, setTestPhone] = useState("");
  const [testMessage, setTestMessage] = useState("");
  const [testResult, setTestResult] = useState<TestSmsResponse|null>(null);

  const balance = balanceData?.data;
  const isSandbox = balance?.isSandbox;

  const handleSendTest = async () => {
    if (!testPhone) {
      toast.error("Enter a phone number");
      return;
    }

    try {
      const result = await sendTestSms({
        phone: testPhone,
        message: testMessage || undefined,
      }).unwrap();

      console.log(result);

      setTestResult(result);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    } catch (err: any) {
      toast.error("Failed to send test SMS");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">SMS Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Africa's Talking Integration
          </p>
        </div>
        <button
          onClick={() => refetchBalance()}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-muted text-foreground rounded-xl text-sm font-medium hover:bg-muted/80 transition-colors"
        >
          <MdOutlineRefresh className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Status Card */}
      <div
        className={`rounded-2xl p-6 border ${
          isSandbox
            ? "bg-warning/5 border-warning/20"
            : "bg-success/5 border-success/20"
        }`}
      >
        <div className="flex items-center gap-3">
          {isSandbox ? (
            <HiOutlineExclamationTriangle className="w-8 h-8 text-warning" />
          ) : (
            <HiOutlineCheckCircle className="w-8 h-8 text-success" />
          )}
          <div>
            <h3 className="font-semibold text-foreground">
              {isSandbox ? "Sandbox Mode" : "Production Mode"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isSandbox
                ? "SMS will only be sent to your registered phone number. Request a sender ID to go live."
                : "SMS is live. Messages will be sent to all numbers."}
            </p>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <HiOutlineCurrencyDollar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Account Balance</p>
            {isBalanceLoading ? (
              <div className="h-6 w-24 _shimmer rounded mt-1" />
            ) : (
              <p className="text-2xl font-bold text-foreground">
                {balance?.balance || "N/A"}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <HiOutlineShieldCheck className="w-3.5 h-3.5" />
          <span>Country: {balance?.countryCode || "GH"}</span>
        </div>
      </div>

      {/* Test SMS Card */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <HiOutlinePaperAirplane className="w-5 h-5 text-primary" />
          Send Test SMS
        </h3>

        <div className="space-y-4">
          <Input
            label="Phone Number"
            type="tel"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            placeholder="e.g., 024XXXXXXX"
          />

          <Textarea
            label="Message (optional)"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Leave empty for default test message"
            rows={2}
          />

          <Button
            onClick={handleSendTest}
            loading={isSending}
            disabled={!testPhone}
            text="Send Test SMS"
            loadingText="Sending..."
          >
            <HiOutlinePaperAirplane className="w-4 h-4" />
          </Button>
        </div>

        {/* Test Result */}
        {testResult && (
          <div
            className={`mt-4 rounded-xl p-4 ${
              testResult.success
                ? "bg-success/5 border border-success/20"
                : "bg-destructive/5 border border-destructive/20"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {testResult.success ? (
                <HiOutlineCheckCircle className="w-5 h-5 text-success" />
              ) : (
                <HiOutlineExclamationTriangle className="w-5 h-5 text-destructive" />
              )}
              <span className="text-sm font-medium">
                {testResult.success ? "SMS Sent Successfully" : "SMS Failed"}
              </span>
            </div>
            {testResult.message && (
              <p className="text-xs text-muted-foreground">
                Response: {testResult.message}
              </p>
            )}
            {testResult.recipients && (
              <p className="text-xs text-muted-foreground">
                Recipients: {testResult.recipients}
              </p>
            )}
          </div>
        )}
      </div>

      {/* How to Activate */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-semibold text-foreground mb-3">
          How to Activate Production SMS
        </h3>
        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
          <li>
            Login to{" "}
            <a
              href="https://account.africastalking.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Africa's Talking Dashboard
            </a>
          </li>
          <li>
            Go to <strong>SMS → Sender IDs</strong>
          </li>
          <li>Request a Sender ID (e.g., "MotoMartGH") — takes 24-48 hours</li>
          <li>Once approved, top up your account via Mobile Money</li>
          <li>Generate a production API key from Settings</li>
          <li>
            Update your{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
              AT_API_KEY
            </code>{" "}
            environment variable
          </li>
          <li>Redeploy your backend</li>
        </ol>
      </div>

      {/* Logs  */}

      <Button
        onClick={() => navigate("/admin/sms/logs")}
        className="grow w-full p-2 my-9"
      >
        View SMS Logs
      </Button>
    </div>
  );
};

export default AdminSmsPage;
