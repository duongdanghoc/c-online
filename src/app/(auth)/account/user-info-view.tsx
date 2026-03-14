"use client";

import { UserInfo } from "@/app/types/user";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import classNames from "classnames";
import "dayjs/locale/vi";
import React from "react";
import UpdateInfoView from "./update-info-view";

interface Props {
  info: UserInfo;
}

const UserInfoView = ({ info }: Props) => {
  const [edit, setEdit] = React.useState(false);

  const [userInfo, setUserInfo] = React.useState<UserInfo | null>(info);

  if (!userInfo) {
    return <></>;
  }

  if (edit) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
        <UpdateInfoView
          info={userInfo}
          onClose={() => setEdit(false)}
          onUpdated={(newInfo) => {
            setUserInfo(newInfo);
            setEdit(false);
          }}
        />
      </LocalizationProvider>
    );
  }

  const dateOfBirth = () => {
    if (!userInfo.dateOfBirth) {
      return "Chưa cập nhật";
    }

    return formatDate(userInfo.dateOfBirth, "DD/MM/YYYY");
  };

  return (
    <div className="w-full">
      <h2>Thông tin cá nhân</h2>

      <div className="container mx-auto mt-8 flex w-full max-w-[500px] flex-col">
        <div className="flex w-full py-4">
          <div className="text-slate-600">Họ và tên</div>
          <div className="flex-1 text-end font-semibold text-slate-800">
            {userInfo.fullName}
          </div>
        </div>
        <div className="h-[1px] w-full bg-slate-200"></div>
        <div className="flex w-full py-4">
          <div className="text-slate-600">Số điện thoại</div>
          <div className="flex-1 text-end font-semibold text-slate-800">
            {userInfo.phoneNumber}
          </div>
        </div>
        <div className="h-[1px] w-full bg-slate-200"></div>
        <div className="flex w-full py-4">
          <div className="text-slate-600">Ngày sinh</div>
          <div
            className={classNames({
              "flex-1 text-end font-semibold": true,
              "text-slate-400": !userInfo.dateOfBirth,
              "text-slate-800": !!userInfo.dateOfBirth,
            })}
          >
            {dateOfBirth()}
          </div>
        </div>
        <div className="h-[1px] w-full bg-slate-200"></div>
        <div className="flex w-full py-4">
          <div className="text-slate-600">Giới tính</div>
          <div
            className={classNames({
              "flex-1 text-end font-semibold": true,
              "text-slate-500": !userInfo.gender,
              "text-slate-800": !!userInfo,
            })}
          >
            {!!userInfo.gender ? userInfo.gender : "Chưa cập nhật"}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center">
          <Button className="rounded-full" onClick={() => setEdit(true)}>
            Cập nhật thông tin
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserInfoView;
