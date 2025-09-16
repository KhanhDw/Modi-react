import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import React, { useEffect } from "react";
export default function ArticleDetailModal({
  open,
  onOpenChange,
  dataArticle,
  onEdit,
  onDelete,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-7xl w-full max-h-[85vh] overflow-y-auto [&>button]:hover:bg-gray-700/30 [&>button]:text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Nội dung bài viết</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {dataArticle &&
            Object.entries(dataArticle).map(([key, value]) => (
              <div key={key} className="border rounded-xl p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg text-gray-500">
                    Phần: {key}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(key, value)}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(key)}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>

                {key.startsWith("content") && (
                  <>
                    {value.paraTitle && (
                      <p className="text-sm text-white">
                        <strong>Tiêu đề:</strong> {value.paraTitle}
                      </p>
                    )}
                    {value.paragraph && (
                      <p className="text-white">Nội dung: {value.paragraph}</p>
                    )}
                    {value.subPara && (
                      <p className="text-white">
                        Nội dung phụ: {value.subPara}
                      </p>
                    )}
                  </>
                )}

                {key.startsWith("img") && (
                  <div>
                    <p className="text-sm text-gray-700">
                      <strong>Tiêu đề:</strong> {value.imgTitle}
                    </p>
                    <img
                      src={value.img}
                      alt=""
                      className="w-32 h-32 object-cover"
                    />
                    {value.imgPara && <p>Nội dung: {value.imgPara}</p>}
                    {value.imgSubPara && (
                      <p className="text-gray-500">
                        Nội dung phụ: {value.imgSubPara}
                      </p>
                    )}
                  </div>
                )}

                {key.startsWith("tbl") && (
                  <>
                    {value.tblTitle && (
                      <p className="text-sm text-gray-700">
                        <strong>Tiêu đề:</strong> {value.tblTitle}
                      </p>
                    )}
                    {Array.isArray(value.tbl) && value.tbl.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
                          <tbody>
                            {value.tbl.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.map((cell, colIndex) => (
                                  <td
                                    key={colIndex}
                                    className="border border-gray-300 px-2 py-1 text-center text-white"
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {value.tblPara && <p>Nội dung: {value.tblPara}</p>}
                    {value.tblSubPara && (
                      <p className="text-gray-500">
                        Nội dung phụ: {value.tblSubPara}
                      </p>
                    )}
                  </>
                )}

                {key.startsWith("link") && (
                  <>
                    <p className="text-sm text-gray-700">
                      <strong>Tiêu đề:</strong> {value.linkTitle}
                    </p>
                    <a
                      href={value.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Link: {value.link}
                    </a>
                    {value.linkPara && <p>Nội dung: {value.linkPara}</p>}
                    {value.linkSubPara && (
                      <p>Nội dung phụ: {value.linkSubPara}</p>
                    )}
                  </>
                )}
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
