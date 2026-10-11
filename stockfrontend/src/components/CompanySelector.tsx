import { useEffect, useState } from "react";
import {
  getCompanies,
  type Company,
} from "../services/api";

interface CompanySelectorProps {
  selectedCompany: string;
  onCompanyChange: (symbol: string) => void;
}

export default function CompanySelector({
  selectedCompany,
  onCompanyChange,
}: CompanySelectorProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCompanies() {
      try {
        const result = await getCompanies();
        setCompanies(result.companies);
      } catch (err) {
        setError("Unable to load companies");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadCompanies();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-gray-500 text-sm">
          Loading companies...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-4">
        <p className="text-red-500 text-sm">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <label
        htmlFor="company"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Select Company
      </label>

      <select
        id="company"
        value={selectedCompany}
        onChange={(e) => onCompanyChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5
                   text-gray-700 bg-white outline-none
                   focus:ring-2 focus:ring-[#8E3A73]
                   focus:border-[#8E3A73]"
      >
        {companies.map((company) => (
          <option
            key={company.symbol}
            value={company.symbol}
          >
            {company.name} ({company.symbol})
          </option>
        ))}
      </select>
    </div>
  );
}