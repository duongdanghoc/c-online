import { addCoupon, removeCoupon } from "@/app/api/promo";
import { BaseError } from "@/app/types/base-error";
import { SelectedPromo } from "@/app/types/promo";
import LoginView from "@/components/login/login-view";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { useLogin } from "@/store/login-store";
import { useMutation } from "@tanstack/react-query";
import classNames from "classnames";
import { Loader2Icon } from "lucide-react";
import { useRef, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { toast } from "sonner";

interface Props {
  cartId: string;
  selectedPromos: SelectedPromo[];
  onCouponChanged?: () => void;
  isLoggedIn: boolean;
}

const CouponView = ({
  selectedPromos,
  cartId,
  onCouponChanged,
  isLoggedIn,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: applyCoupon, isPending: isApplyingCoupon } = useMutation({
    mutationKey: ["apply-coupon"],
    mutationFn: async (code: string) => {
      return await addCoupon(cartId, code);
    },
    onSuccess() {
      onCouponChanged?.();
    },
    onError(e: BaseError) {
      toast.error(e.message || "Có lỗi xảy ra, vui lòng thử lại");
    },
  });

  const { mutate: removeCouponMutate, isPending: isRemovingCoupon } =
    useMutation({
      mutationKey: ["remove-coupon"],
      mutationFn: async (code: string) => {
        return await removeCoupon(cartId, code);
      },
      onSuccess() {
        onCouponChanged?.();
      },
      onError(e: BaseError) {
        toast.error(e.message || "Có lỗi xảy ra, vui lòng thử lại");
      },
    });

  const handleApplyCoupon = () => {
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để sử dụng mã giảm giá");
      return;
    }
    const code = inputRef.current?.value;
    if (!code) {
      return;
    }
    applyCoupon(code);
    inputRef.current!.value = "";
  };

  const { reset } = useLogin();
  const [openLogin, setOpenLogin] = useState(false);

  const onLoginSuccess = () => {
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  if (!isLoggedIn) {
    return (
      <div className="rounded-xl bg-white p-4">
        <div className="flex flex-col items-center justify-center gap-2 py-4">
          <div className="text-center text-sm text-gray-500">
            Bạn cần đăng nhập để sử dụng mã giảm giá
          </div>
          <Dialog open={openLogin} onOpenChange={setOpenLogin}>
            <DialogTrigger asChild>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  reset();
                  setOpenLogin(true);
                }}
              >
                Đăng nhập ngay
              </Button>
            </DialogTrigger>
            <DialogContent
              className="w-[95%] max-w-[425px] rounded-xl"
              hideCloseButton={true}
            >
              <LoginView onLoginSuccess={onLoginSuccess} />
              <div className="absolute top-2 right-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="z-50 h-8 w-8"
                  onClick={() => setOpenLogin(false)}
                >
                  <MdOutlineClose
                    className="h-6 w-6"
                    style={{
                      width: 24,
                      height: 24,
                    }}
                  />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {selectedPromos.length > 0 && (
          <>
            <div className="mt-4 mb-2 text-sm">Mã giảm giá đã áp dụng</div>
            <div className="flex flex-col gap-4">
              {selectedPromos.map((promo) => (
                <PromoItem
                  key={promo.id}
                  promo={promo}
                  isRemoving={isRemovingCoupon}
                  onRemove={() => {
                    if (isRemovingCoupon) return;
                    if (!promo.couponCodes?.[0]) return;
                    removeCouponMutate(promo.couponCodes[0].code);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-4">
      <div className="flex w-full max-w-sm items-center gap-2">
        <Input
          type="text"
          className="shadow-none"
          placeholder="Mã giảm giá"
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleApplyCoupon();
            }
          }}
        />
        <Button
          disabled={isApplyingCoupon || isRemovingCoupon}
          type="submit"
          variant="default"
          onClick={() => {
            handleApplyCoupon();
          }}
        >
          Áp dụng{" "}
          {(isApplyingCoupon || isRemovingCoupon) && (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          )}
        </Button>
      </div>
      <div className="mt-4 mb-2 text-sm">Mã giảm giá đã áp dụng</div>
      <div className="flex flex-col gap-4">
        {selectedPromos.map((promo) => (
          <PromoItem
            key={promo.id}
            promo={promo}
            isRemoving={isRemovingCoupon}
            onRemove={() => {
              if (isRemovingCoupon) return;
              if (!promo.couponCodes?.[0]) return;
              removeCouponMutate(promo.couponCodes[0].code);
            }}
          />
        ))}
      </div>
    </div>
  );
};

function PromoItem({
  promo,
  onRemove,
  isRemoving,
}: {
  promo: SelectedPromo;
  onRemove: (code: string) => void;
  isRemoving: boolean;
}) {
  if (promo.isApplicable === false && promo.autoApply === true) {
    return null;
  }

  const code = promo.couponCodes?.[0];
  return (
    <div className="flex items-start gap-2">
      <div
        className={classNames(
          "flex h-8 w-8 items-center justify-center rounded-sm",
          promo.isApplicable == false
            ? "bg-gray-100 text-gray-500"
            : "bg-orange-100 text-orange-500"
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
          />
        </svg>
      </div>
      <div className="flex-1 text-xs text-gray-600">
        <div>{promo.name}</div>
        {promo.isApplicable && (
          <div className="flex gap-2 text-sm font-medium text-gray-700">
            - {formatPrice(promo.discount)}
            {!promo.autoApply && (
              <div className="bg-primary/10 text-primary flex items-center rounded-md px-2 text-xs font-semibold">{` (${code.code})`}</div>
            )}
          </div>
        )}
        {promo.isApplicable === false && (
          <div className="text-xs text-red-500">Chưa đủ điều kiện áp dụng</div>
        )}
      </div>
      {!promo.autoApply && (
        <div>
          <Button
            disabled={isRemoving}
            variant="ghost"
            size="icon"
            className="text-gray-400"
            onClick={() => onRemove(code.code)}
          >
            {isRemoving ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default CouponView;
