
'use client';

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PaginationControlsProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage: number;
    onItemsPerPageChange: (value: string) => void;
    totalItems: number;
    itemName?: string;
    itemsPerPageOptions?: number[];
}

export default function PaginationControls({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    onItemsPerPageChange,
    totalItems,
    itemName = 'items',
    itemsPerPageOptions = [10, 20, 50]
}: PaginationControlsProps) {

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
                Showing {startItem}-{endItem} of {totalItems} {itemName}
            </p>
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show:</span>
                <Select value={String(itemsPerPage)} onValueChange={onItemsPerPageChange}>
                <SelectTrigger className="h-9 w-[70px]">
                    <SelectValue placeholder={itemsPerPage} />
                </SelectTrigger>
                <SelectContent>
                    {itemsPerPageOptions.map(option => (
                        <SelectItem key={option} value={String(option)}>{option}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            </div>
            <div className="flex items-center gap-2">
            <Button variant="outline" className="h-10" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>Previous</Button>
            {[...Array(totalPages)].map((_, i) => (
                <Button 
                    key={i} 
                    variant={currentPage === i + 1 ? "gradient" : "outline"}
                    className="h-10 w-10 p-0"
                    onClick={() => onPageChange(i + 1)}
                >
                    {i + 1}
                </Button>
            ))}
            <Button variant="outline" className="h-10" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>Next</Button>
            </div>
      </div>
    )
}
