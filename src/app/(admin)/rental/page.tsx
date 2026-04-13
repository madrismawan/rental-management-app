"use client";

import { DataTable } from "@/components/common/data-table";
import { rentalAPI } from "@/lib/api/endpoints/rental";
import { Rental } from "@/lib/api/resource/rental";
import { useEffect, useState } from "react";
import { rentalColumns } from "./data/rental-columns";

export default function RentalPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      const res = await rentalAPI.getAll();
      if (res.success && res.data) {
        setRentals(res.data);
      }
      setLoading(false);
    };

    fetchRentals();
  }, []);

  return (
    <section className="grid gap-4 container">
      <div>
        <p className="font-bold">Rental</p>
        <p>View rental records and open detail pages.</p>
      </div>
      <DataTable
        columns={rentalColumns}
        data={rentals}
        filterSearchKey={["id", "customerId", "vehicleId", "status"]}
      />
      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
    </section>
  );
}
