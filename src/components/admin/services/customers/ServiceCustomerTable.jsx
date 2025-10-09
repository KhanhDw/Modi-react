import useVipConfig from "@/components/admin/services/hooks/useVipConfig.js";
import Pagination from "@/components/admin/services/utils/Pagination.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useLenisLocal from "@/hook/useLenisLocal";
import { Edit, Eye, Search, Trash2 } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import ConfigCustomerVIP from "./configCustomerVIP";
import ExcelDataUploader from "./ExcelDataUploader";
import ReadInforCustomer from "./readInforCustomer";
import CustomSelectFilter from "@/pages/managers/service/CustomSelectFilter";
import TableRowActions from "@/pages/managers/service/TableRowActions";
import { X } from "lucide-react";
import "@/styles/styleVIP.css";

export default function ServiceCustomerTable() {
  const {
    initDataCustomer,
    initDataBooking,
    openEditCustomerForm,
    handleDeleteCustomer,
    handleRefetchCustomer,
  } = useOutletContext();

  useLenisLocal(".lenis-local");
  const [openConfigCustomerVIP, setOpenConfigCustomerVIP] = useState(false);
  const [openDialogImportCustomer, setOpenDialogImportCustomer] =
    useState(false);
  const [openReadInforCustomer, setOpenReadInforCustomer] = useState(false);
  const [customerDetail, setCustomerDetail] = useState(null);
  const [loadingCustomer, setLoadingCustomer] = useState(false);

  const { minSpent, fetchVipConfig } = useVipConfig();

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sử dụng ref để lưu trữ data mới nhất
  const initDataCustomerRef = useRef(initDataCustomer);
  const minSpentRef = useRef(minSpent);

  // Cập nhật ref khi data thay đổi
  useEffect(() => {
    initDataCustomerRef.current = initDataCustomer;
    minSpentRef.current = minSpent;
  }, [initDataCustomer, minSpent]);

  // Sử dụng useCallback để tránh tạo hàm mới mỗi lần render
  const updateCustomerFitIsVip = useCallback(async (id_customer) => {
    try {
      await fetch(
        `${
          import.meta.env.VITE_MAIN_BE_URL
        }/api/customers/update_vip/${id_customer}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error updating customer to VIP:", error);
    }
  }, []);

  const updateCustomerIsVipToOld = useCallback(async (id_customer) => {
    try {
      await fetch(
        `${
          import.meta.env.VITE_MAIN_BE_URL
        }/api/customers/update_vip_to_old/${id_customer}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error updating VIP customer to old:", error);
    }
  }, []);

  // Sửa lại hàm checkUpdateCustomerFitIsVip
  const checkUpdateCustomerFitIsVip = useCallback(async () => {
    try {
      // Fetch config mới nhất
      const vipConfig = await fetchVipConfig();
      const currentMinSpent = vipConfig.min_spent;

      // Sử dụng data từ ref để đảm bảo luôn có data mới nhất
      const currentCustomers = initDataCustomerRef.current;

      // Sử dụng Promise.all để xử lý bất đồng bộ hiệu quả
      const updatePromises = currentCustomers.map(async (customer) => {
        const shouldBeVip = customer.total_spent >= currentMinSpent;
        const isCurrentlyVip = customer.type === "vip";

        if (!isCurrentlyVip && shouldBeVip) {
          await updateCustomerFitIsVip(customer.id);
          return { id: customer.id, action: "upgraded" };
        } else if (isCurrentlyVip && !shouldBeVip) {
          await updateCustomerIsVipToOld(customer.id);
          return { id: customer.id, action: "downgraded" };
        }
        return null;
      });

      const results = await Promise.all(updatePromises);
      const changes = results.filter((result) => result !== null);

      if (changes.length > 0) {
        handleRefetchCustomer();
      }
    } catch (error) {
      console.error("❌ Error in VIP customer check:", error);
    }
  }, [
    fetchVipConfig,
    updateCustomerFitIsVip,
    updateCustomerIsVipToOld,
    handleRefetchCustomer,
  ]);

  // Listen for storage events to trigger VIP check, and check on mount.
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "customerDataUpdated") {
        checkUpdateCustomerFitIsVip();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    checkUpdateCustomerFitIsVip(); // Initial check on mount

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [checkUpdateCustomerFitIsVip]);

  // Function load dữ liệu khách hàng
  const getFullInforCustomer = async (id) => {
    try {
      setLoadingCustomer(true);
      setCustomerDetail(null);
      setOpenReadInforCustomer(false);

      const res = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/customers/${id}/full`
      );

      if (!res.ok) throw new Error("Không thể lấy dữ liệu khách hàng");

      const data = await res.json();

      setCustomerDetail(data);
      setOpenReadInforCustomer(true);
    } catch (err) {
      console.error("Error fetching customer details:", err);
      setCustomerDetail(null);
      // Có thể thêm toast notification ở đây
    } finally {
      setLoadingCustomer(false);
    }
  };

  const changeStatus = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const filteredCustomer = initDataCustomer.filter((customer) => {
    const keyword = search.toLowerCase();
    const isVip = customer.total_spent >= minSpent;
    const groupType = isVip ? "vip" : "thuong";

    // const groupType = customer.type === "vip" ? "vip" : "thuong";

    const matchSearch =
      customer.name.toLowerCase().includes(keyword) ||
      groupType.includes(keyword);

    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "new" && groupType === "thuong") ||
      (statusFilter === "vip" && groupType === "vip");

    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredCustomer.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredCustomer.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="space-y-6">
      <Card className="bg-white border-gray-300 admin-dark:bg-gray-800 admin-dark:border-gray-700">
        <CardHeader>
          <div className="flex flex-col md:flex-col xl:flex-row items-center justify-between">
            <div>
              <CardTitle className="admin-dark:text-white text-xl xl:text-start text-center">
                Danh sách khách hàng
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2 mb-2 xl:text-start text-center admin-dark:text-gray-400">
                Quản lý tất cả khách hàng đã sử dụng dịch vụ
              </CardDescription>
            </div>
            <div className="flex flex-col md:flex-row items-center md:justify-between gap-2 md:gap-5">
              <div className="relative bg-white admin-dark:bg-gray-800 rounded-md shadow-sm text-black admin-dark:text-white">
                <Search className="absolute left-3 top-[10px] h-4 w-4 text-muted-foreground admin-dark:text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Tìm kiếm khách hàng..."
                  className="pl-10 w-64 admin-dark:bg-gray-700 admin-dark:text-white admin-dark:border-gray-600 admin-dark:placeholder-gray-400"
                />
              </div>
              <CustomSelectFilter
                value={statusFilter}
                onValueChange={changeStatus}
                placeholder="Trạng thái"
                className="w-fit"
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "new", label: "Thường" },
                  { value: "vip", label: "Vip" },
                ]}
              />

              <button
                className="bg-gray-800 hover:bg-slate-700 admin-dark:bg-blue-500 admin-dark:hover:bg-blue-600 text-white font-bold py-1.5 px-2 rounded-md shadow-lg transform transition-all duration-200 ease-in-out cursor-pointer"
                onClick={() => setOpenDialogImportCustomer(true)}
              >
                <span className="text-sm lg:text-base">
                  Nhập dữ liệu khách hàng
                </span>
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-black admin-dark:text-white">
          <div className="rounded-md border border-gray-300 admin-dark:border-gray-700 bg-white admin-dark:bg-gray-800 shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="admin-dark:border-gray-700">
                  <TableHead className="text-black admin-dark:text-white">
                    STT
                  </TableHead>
                  <TableHead className="text-black admin-dark:text-white">
                    Tên khách hàng
                  </TableHead>
                  <TableHead className="text-black admin-dark:text-white">
                    SĐT
                  </TableHead>
                  <TableHead className="text-black admin-dark:text-white">
                    Email
                  </TableHead>
                  <TableHead className="text-black admin-dark:text-white">
                    Số CCCD
                  </TableHead>
                  <TableHead className="text-black admin-dark:text-white">
                    Số tài khoản ngân hàng
                  </TableHead>
                  <TableHead className="text-black admin-dark:text-white">
                    Tên ngân hàng
                  </TableHead>
                  <TableHead className="text-black admin-dark:text-white">
                    Đã đặt
                  </TableHead>
                  <TableHead className="text-black admin-dark:text-white">
                    Hoàn thành
                  </TableHead>
                  <TableHead className="text-black admin-dark:text-white">
                    Chi
                  </TableHead>
                  <TableHead className="text-black admin-dark:text-white">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((customer, index) => (
                  <TableRow
                    key={customer.id}
                    className="admin-dark:border-gray-700 admin-dark:hover:bg-gray-750"
                  >
                    <TableCell className="text-black admin-dark:text-white">
                      {startIndex + index + 1}
                    </TableCell>

                    <TableCell className="text-black admin-dark:text-white flex gap-2">
                      {customer.type === "vip" ? (
                        <div className="vip-badge  rounded-sm px-1 bg-yellow-300">
                          <span className="badge-text text-xs font-semibold text-black admin-dark:text-black">
                            VIP
                          </span>
                        </div>
                      ) : null}
                      {customer.name}
                    </TableCell>
                    <TableCell className="text-black admin-dark:text-white">
                      {customer.phone || "Chưa cập nhật"}
                    </TableCell>
                    <TableCell className="text-black admin-dark:text-white">
                      {customer.email || "Chưa cập nhật"}
                    </TableCell>
                    <TableCell className="text-black admin-dark:text-white">
                      {customer.cccd || "Chưa cập nhật"}
                    </TableCell>
                    <TableCell className="text-black admin-dark:text-white">
                      {customer.number_bank || "Chưa cập nhật"}
                    </TableCell>
                    <TableCell className="text-black admin-dark:text-white">
                      {customer.name_bank || "Chưa cập nhật"}
                    </TableCell>
                    <TableCell className="text-black admin-dark:text-white pl-6">
                      {customer.booking_count || 0}
                    </TableCell>
                    <TableCell className="text-black admin-dark:text-white pl-9">
                      {
                        initDataBooking.filter(
                          (c) =>
                            c.customer_id === customer.id &&
                            c.status === "completed"
                        ).length
                      }
                    </TableCell>
                    <TableCell className="text-black admin-dark:text-white">
                      {Number(customer.total_spent || 0).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      ₫
                    </TableCell>
                    <TableCell className="flex items-center space-x-2">
                      <TableRowActions
                        actions={[
                          {
                            label: "Xem chi tiết",
                            icon: Eye,
                            onClick: () => getFullInforCustomer(customer.id),
                          },
                          {
                            label: "Chỉnh sửa",
                            icon: Edit,
                            onClick: () => openEditCustomerForm(customer),
                          },
                          {
                            label: "Xóa",
                            icon: Trash2,
                            onClick: () => handleDeleteCustomer(customer.id),
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {currentData.length === 0 && (
                  <TableRow className="admin-dark:border-gray-700 w-full ">
                    <TableCell
                      colSpan={11}
                      className="text-center py-4 text-gray-500 admin-dark:text-gray-400"
                    >
                      Không tìm thấy khách hàng
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between mt-4 gap-2 items-center w-full">
            <div className="w-full flex justify-center sm:justify-start">
              <button
                onClick={() => setOpenConfigCustomerVIP(true)}
                type="button"
                className="flex items-center space-x-2 text-gray-700 admin-dark:text-gray-300 cursor-pointer"
              >
                <span className=" transition-all duration-300 text-sm lg:text-base text-gray-700 admin-dark:text-gray-300 hover:text-blue-500 hover:scale-105 font-semibold admin-dark:hover:text-yellow-400">
                  Thiết lập điều kiện là khách hàng VIP
                </span>
              </button>
            </div>
            <div className="w-full sm:w-fit items-center justify-center flex sm:justify-end">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {openConfigCustomerVIP && (
        <div
          data-lenis-prevent
          className="lenis-local overflow-y-auto fixed inset-0 z-50 flex items-center justify-center  min-h-screen"
        >
          <div className="relative  rounded-lg shadow-2xl  min-w-[350px] max-w-[90vw] w-full flex flex-col items-center">
            <button
              hidden
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 admin-dark:text-gray-400 admin-dark:hover:text-white text-xl font-bold cursor-pointer"
              onClick={() => setOpenConfigCustomerVIP(false)}
              aria-label="Đóng"
            >
              &times;
            </button>
            <ConfigCustomerVIP
              setOpenConfigCustomerVIP={setOpenConfigCustomerVIP}
              onSaveSuccess={checkUpdateCustomerFitIsVip}
            />
          </div>
        </div>
      )}

      {/* Component Upload Excel */}
      {openDialogImportCustomer && (
        <div
          data-lenis-prevent
          className="lenis-local overflow-y-auto scrollbar-hide fixed inset-0 z-50 flex items-center justify-center admin-dark:bg-black/90 bg-white min-h-screen"
        >
          <div className="relative rounded-lg w-full flex flex-col items-center p-2">
            <button
              hidden
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 admin-dark:text-gray-400 admin-dark:hover:text-white text-xl font-bold cursor-pointer"
              onClick={() => setOpenDialogImportCustomer(false)}
              aria-label="Đóng"
            >
              &times;
            </button>
            <ExcelDataUploader
              openDialogImportCustomer={openDialogImportCustomer}
              setOpenDialogImportCustomer={setOpenDialogImportCustomer}
            />
          </div>
        </div>
      )}

      {/* Modal hiển thị thông tin chi tiết khách hàng */}
      {openReadInforCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 admin-dark:bg-black/60 px-3 sm:px-5 md:px-8"
          onClick={() => {
            setOpenReadInforCustomer(false);
            setCustomerDetail(null);
            setLoadingCustomer(false);
          }}
        >
          <div
            className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-xl shadow-2xl
               bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700
               p-3 sm:p-4 transition-all duration-300 scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút đóng */}
            <button
              onClick={() => {
                setOpenReadInforCustomer(false);
                setCustomerDetail(null);
                setLoadingCustomer(false);
              }}
              className="absolute top-1 sm:top-3 right-3 flex items-center justify-center
             w-9 h-9 rounded-full border border-gray-300 bg-white/80 text-gray-600
             hover:bg-gray-100 hover:text-gray-900 hover:shadow-md
             admin-dark:border-gray-600 admin-dark:bg-gray-800 admin-dark:text-gray-300
             admin-dark:hover:bg-gray-700 admin-dark:hover:text-white
             transition-all duration-200 cursor-pointer backdrop-blur-sm z-50"
              aria-label="Đóng"
            >
              <X
                className="h-5 w-5"
                strokeWidth={2.2}
              />
            </button>

            {/* Nội dung */}
            {(() => {
              if (loadingCustomer) {
                return (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-700 admin-dark:text-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 admin-dark:border-gray-300"></div>
                    <p className="mt-4 text-sm font-medium">
                      Đang tải dữ liệu...
                    </p>
                  </div>
                );
              } else if (customerDetail) {
                return <ReadInforCustomer data={customerDetail} />;
              } else {
                return (
                  <div className="text-center py-10 text-red-600 admin-dark:text-red-400 font-medium">
                    Không tìm thấy dữ liệu hoặc có lỗi xảy ra
                  </div>
                );
              }
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
