import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  joinWaitlist,
  leaveWaitlist,
  getWaitlistPosition,
  claimWaitlistSlot,
} from "../../redux/slices/waitlistSlice";
import { issueBook } from "../../redux/slices/borrowSlice";
import toast from "react-hot-toast";
import { Clock as FiClock, AlertTriangle as FiAlertTriangle, CheckCircle as FiCheckCircle } from "lucide-react";

/**
 * WaitlistButton — dynamically renders one of three states:
 *   1. "Join Waitlist" (not on list)
 *   2. Position indicator + leave option (waiting)
 *   3. Urgent claim with countdown (notified, 24h window)
 */
const WaitlistButton = ({ bookId, isAvailable }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { positions, loading } = useSelector((state) => state.waitlist);

  const pos = positions[bookId];

  useEffect(() => {
    if (isAuthenticated && user?.role === "member" && !isAvailable) {
      dispatch(getWaitlistPosition(bookId));
    }
  }, [dispatch, bookId, isAvailable, isAuthenticated, user]);

  // Not visible when book is available or user is not a member
  if (!isAuthenticated || user?.role !== "member" || isAvailable) return null;

  const handleJoin = async () => {
    const result = await dispatch(joinWaitlist(bookId));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success(result.payload.message);
    } else {
      toast.error(result.payload || "Failed to join waitlist");
    }
  };

  const handleLeave = async () => {
    const result = await dispatch(leaveWaitlist(bookId));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Removed from waitlist");
    } else {
      toast.error(result.payload || "Failed to leave waitlist");
    }
  };

  const handleClaim = async () => {
    const claimResult = await dispatch(claimWaitlistSlot(bookId));
    if (claimResult.meta.requestStatus === "fulfilled") {
      // After claiming, immediately issue the book
      const issueResult = await dispatch(issueBook(bookId));
      if (issueResult.meta.requestStatus === "fulfilled") {
        toast.success("Book claimed and borrowed successfully!");
      } else {
        toast.error(issueResult.payload || "Claimed but failed to borrow");
      }
    } else {
      toast.error(claimResult.payload || "Failed to claim slot");
    }
  };

  // Calculate remaining time for claim window
  const getTimeRemaining = () => {
    if (!pos?.expiresAt) return null;
    const diff = new Date(pos.expiresAt) - new Date();
    if (diff <= 0) return "Expired";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m left`;
  };

  // STATE 3: Notified — urgent claim
  if (pos?.onWaitlist && pos?.status === "notified") {
    const timeLeft = getTimeRemaining();
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold bg-amber-50 px-2.5 py-1.5 rounded-lg">
          <FiAlertTriangle className="text-sm animate-pulse" />
          <span>Your turn! {timeLeft && `(${timeLeft})`}</span>
        </div>
        <button
          onClick={handleClaim}
          disabled={loading}
          className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 font-semibold"
        >
          <FiCheckCircle />
          {loading ? "Claiming…" : "Claim & Borrow Now"}
        </button>
        <button
          onClick={handleLeave}
          disabled={loading}
          className="text-xs text-red-500 hover:underline disabled:opacity-50"
        >
          Pass (leave waitlist)
        </button>
      </div>
    );
  }

  // STATE 2: On waitlist — show position
  if (pos?.onWaitlist) {
    return (
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
          <FiClock /> #{pos.position} in queue
          {pos.totalWaiting > 1 && (
            <span className="text-gray-400 font-normal">
              of {pos.totalWaiting}
            </span>
          )}
        </span>
        <button
          onClick={handleLeave}
          disabled={loading}
          className="text-xs text-red-500 hover:underline disabled:opacity-50"
        >
          Leave waitlist
        </button>
      </div>
    );
  }

  // STATE 1: Not on waitlist — join
  return (
    <button
      onClick={handleJoin}
      disabled={loading}
      className="bg-orange-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
    >
      {loading ? "…" : "Join Waitlist"}
    </button>
  );
};

export default WaitlistButton;
