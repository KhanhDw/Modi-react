import useVipConfig from "@/components/admin/services/hooks/useVipConfig.jsx";
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
import { Edit, Eye, Search, Trash2, Settings } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import ConfigCustomerVIP from "./configCustomerVIP";
import ExcelDataUploader from "./ExcelDataUploader";
import ExportCustomerData from "./ExportCustomerData";
import ReadInforCustomer from "./readInforCustomer";
import CustomSelectFilter from "@/pages/managers/service/CustomSelectFilter";
import TableRowActions from "@/pages/managers/service/TableRowActions";
import { X } from "lucide-react";
import "@/styles/styleVIP.css";
import TrashCustomer from "./trashCustomer";

export default function ServiceCustomerTable() {
  const {
    initDataCustomer,
    initDataBooking,
    openEditCustomerForm,
    handleDeleteCustomer,
    handleRefetchCustomer,
    handleGetBookingForCustomerId,
    showToast,
  } = useOutletContext(); // src\pages\managers\ServicesPage.jsx

  useLenisLocal(".lenis-local");
  const [openConfigCustomerVIP, setOpenConfigCustomerVIP] = useState(false);
  const [openDialogImportCustomer, setOpenDialogImportCustomer] =
    useState(false);
  const [openReadInforCustomer, setOpenReadInforCustomer] = useState(false);
  const [customerDetail, setCustomerDetail] = useState(null);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [isDeleteShow, setIsDeleteShow] = useState(false);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [customerToDeleteId, setCustomerToDeleteId] = useState(null);

  const { minSpent, fetchVipConfig } = useVipConfig();

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sử dụng ref để lưu trữ data mới nhất
  const initDataCustomerRef = useRef(initDataCustomer);
  const minSpentRef = useRef(minSpent);

  // Cập nhật ref khi data thay đổi
  useEffect(() => {
    initDataCustomerRef.current = initDataCustomer;
    minSpentRef.current = minSpent;
  }, [initDataCustomer, minSpent]);

  // Hàm bỏ dấu tiếng Việt
  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD") // tách ký tự base và dấu
      .replace(/[\u0300-\u036f]/g, "") // xóa dấu
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D"); // thay đ/Đ
  };

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
    const keyword = removeVietnameseTones(search.toLowerCase());

    const name = removeVietnameseTones(customer.name?.toLowerCase() || "");
    const phone = customer.phone?.toLowerCase() || "";
    const cccd = customer.cccd?.toLowerCase() || "";
    const type = customer.type || "";

    const matchSearch =
      name.includes(keyword) ||
      phone.includes(keyword) ||
      cccd.includes(keyword) ||
      type.includes(keyword);

    const matchStatus = statusFilter === "all" || statusFilter === type;

    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredCustomer.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredCustomer.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const checkCustomerCanBeDeleted = (customerId) => {
    if (handleGetBookingForCustomerId(customerId)) {
      showToast("Không thể xóa khách hàng vì đang có dịch vụ đã đặt.", "error");
      return false;
    }
    return true;
  };

  const handleDeleteClick = (customerId) => {
    if (checkCustomerCanBeDeleted(customerId)) {
      setCustomerToDeleteId(customerId);
      setShowConfirmDeleteDialog(true);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border-gray-300 admin-dark:bg-gray-800 admin-dark:border-gray-700">
        <div className="px-2 sm:px-4">
          <div className="flex flex-col md:flex-col xl:flex-row items-center justify-between">
            <div>
              <CardTitle className="admin-dark:text-white text-base sm:text-lg font-bold xl:text-start text-center">
                Danh sách khách hàng
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2 mb-2 xl:text-start text-center admin-dark:text-gray-400 text-xs sm:text-base md:text-[16px]">
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
                  className="pl-10 w-64 md:w-50 lg:w-60 admin-dark:bg-gray-700 admin-dark:text-white admin-dark:border-gray-600 admin-dark:placeholder-gray-400"
                />
              </div>
              <CustomSelectFilter
                value={statusFilter}
                onValueChange={changeStatus}
                placeholder="Lọc khách hàng"
                className="w-full md:w-50"
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "new", label: "Khách mới" },
                  { value: "regular", label: "Khách thường xuyên" },
                  { value: "old", label: "Khách cũ" },
                  { value: "vip", label: "Khách VIP" },
                ]}
              />

              <ExportCustomerData data={initDataCustomer} />

              <button
                className="bg-gray-800 hover:bg-slate-700 admin-dark:bg-blue-500 admin-dark:hover:bg-blue-600 text-white font-bold py-1.5 px-4 rounded-md shadow-lg transform transition-all duration-200 ease-in-out cursor-pointer"
                onClick={() => setOpenDialogImportCustomer(true)}
              >
                <span className="text-sm lg:text-base">Nhập danh sách</span>
              </button>
            </div>
          </div>
        </div>
        <CardContent className="text-black admin-dark:text-white">
          <div className="rounded-md border border-gray-300 admin-dark:border-gray-700 bg-white admin-dark:bg-gray-800 shadow-sm">
            <Table className="w-full text-sm text-gray-800 dark:text-gray-200">
              <TableHeader>
                <TableRow className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <TableHead className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100 text-left uppercase tracking-wider text-xs">
                    STT
                  </TableHead>
                  <TableHead className="px-4 py-3 text-gray-900 dark:text-gray-100">
                    Tên khách hàng
                  </TableHead>
                  <TableHead className="px-4 py-3 text-gray-900 dark:text-gray-100 text-center">
                    SĐT
                  </TableHead>
                  <TableHead className="px-4 py-3 text-gray-900 dark:text-gray-100 text-center">
                    Email
                  </TableHead>
                  <TableHead className="px-4 py-3 text-gray-900 dark:text-gray-100 text-center">
                    Số CCCD
                  </TableHead>
                  <TableHead className="px-4 py-3 text-gray-900 dark:text-gray-100 text-center">
                    Số tài khoản ngân hàng
                  </TableHead>
                  <TableHead className="px-4 py-3 text-gray-900 dark:text-gray-100 text-center">
                    Tên ngân hàng
                  </TableHead>
                  <TableHead className="px-4 py-3 text-center text-gray-900 dark:text-gray-100 ">
                    Đã đặt
                  </TableHead>
                  <TableHead className="px-4 py-3 text-center text-gray-900 dark:text-gray-100">
                    Hoàn thành
                  </TableHead>
                  <TableHead className="px-4 py-3 text-center text-gray-900 dark:text-gray-100">
                    Chi
                  </TableHead>
                  <TableHead className="px-4 py-3 text-center text-gray-900 dark:text-gray-100">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentData.map((customer, index) => (
                  <TableRow
                    key={customer.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <TableCell className="px-4 py-2 text-center font-medium">
                      {startIndex + index + 1}
                    </TableCell>

                    <TableCell className="px-4 py-2 flex items-center gap-2">
                      {customer.type === "vip" && (
                        <div className="px-2 py-0.5 bg-yellow-300 text-xs font-semibold text-black rounded-sm shadow-sm">
                          VIP
                        </div>
                      )}
                      <span>{customer.name}</span>
                    </TableCell>

                    <TableCell className="px-4 py-2">
                      {customer.phone || (
                        <span className="text-gray-400 italic">
                          Chưa cập nhật
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="px-4 py-2 truncate max-w-[200px]">
                      {customer.email || (
                        <span className="text-gray-400 italic">
                          Chưa cập nhật
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="px-4 py-2 text-center">
                      {customer.cccd || (
                        <span className="text-gray-400 italic">
                          Chưa cập nhật
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="px-4 py-2 text-center">
                      {customer.number_bank || (
                        <span className="text-gray-400 italic">
                          Chưa cập nhật
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="px-4 py-2 text-center">
                      {customer.name_bank || (
                        <span className="text-gray-400 italic">
                          Chưa cập nhật
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="px-4 py-2 text-center">
                      {customer.booking_count || 0}
                    </TableCell>

                    <TableCell className="px-4 py-2 text-center">
                      {
                        initDataBooking.filter(
                          (c) =>
                            c.customer_id === customer.id &&
                            c.status === "completed"
                        ).length
                      }
                    </TableCell>

                    <TableCell className="px-4 py-2 text-center font-medium text-green-700 dark:text-green-400">
                      {Number(customer.total_spent || 0).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      ₫
                    </TableCell>

                    <TableCell className="px-4 py-2 text-center">
                      <div className="flex justify-center items-center gap-2">
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
                              onClick: () => handleDeleteClick(customer.id),
                            },
                          ]}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {currentData.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={11}
                      className="py-6 text-center text-gray-500 dark:text-gray-400 italic"
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
            <div className="w-full flex justify-center sm:justify-start gap-2">
              <button
                onClick={() => setOpenConfigCustomerVIP(true)}
                type="button"
                className="flex items-center space-x-2 text-gray-700 admin-dark:text-gray-300 cursor-pointer"
              >
                <span className=" transition-all duration-300 text-sm lg:text-base text-gray-700 admin-dark:text-gray-300 hover:text-blue-500 hover:scale-105 font-semibold admin-dark:hover:text-yellow-400 gap-2 flex flex-row items-center bg-gray-200 admin-dark:bg-gray-700 p-1 rounded-md">
                  <Settings />
                  VIP
                </span>
              </button>
              <button
                onClick={() => setIsDeleteShow(true)}
                type="button"
                className="flex items-center space-x-2 text-gray-700 admin-dark:text-gray-300 cursor-pointer"
              >
                <span className=" transition-all duration-300 text-sm lg:text-base text-gray-700 admin-dark:text-gray-300 hover:text-blue-500 hover:scale-105 font-semibold admin-dark:hover:text-yellow-400 gap-2 flex flex-row items-center bg-gray-200 admin-dark:bg-gray-700 p-1 rounded-md">
                  <Trash2 />
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
      {/* Modal hiển thị khách hàng đã xóa */}
      {isDeleteShow && (
        <TrashCustomer
          setIsDeleteShow={setIsDeleteShow}
          handleRefetchCustomer={handleRefetchCustomer}
        />
      )}

      {/* Delete Confirmation Custom Modal */}

      {showConfirmDeleteDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 admin-dark:bg-black/60 px-3 sm:px-5 md:px-8"
          onClick={() => {
            setShowConfirmDeleteDialog(false);
            setCustomerToDeleteId(null);
          }}
        >
          <div
            className="relative w-full max-w-md rounded-xl shadow-2xl bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700 p-6 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 admin-dark:text-white mb-4">
              Xác nhận xóa khách hàng
            </h3>

            <p className="text-sm text-gray-600 admin-dark:text-gray-400 mb-6">
              Bạn có chắc chắn muốn xóa khách hàng này không? Hành động này
              không thể hoàn tác.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 admin-dark:text-gray-300 bg-gray-200 admin-dark:bg-gray-700 rounded-md hover:bg-gray-300 admin-dark:hover:bg-gray-600 transition-colors"
                onClick={() => {
                  setShowConfirmDeleteDialog(false);

                  setCustomerToDeleteId(null);
                }}
              >
                Hủy
              </button>

              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                onClick={async () => {
                  if (customerToDeleteId) {
                    await handleDeleteCustomer(customerToDeleteId);
                    setCustomerToDeleteId(null);
                  }
                  setShowConfirmDeleteDialog(false);
                }}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
