import { calculateErrorPercent, formatCurrency, formatDate, formatPercent } from "../utils/formatters";
import Badge from "./Badge";
import EmptyState from "./EmptyState";

export default function HistoryTable({ rows }) {
  if (!rows.length) {
    return (
      <EmptyState
        title="Belum ada histori prediksi"
        message="Jalankan prediksi pertama untuk mengisi tabel evaluasi model."
      />
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Aset</th>
            <th>Horizon</th>
            <th>Prediksi</th>
            <th>Aktual</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const error = calculateErrorPercent(row.predicted_price, row.actual_price);

            return (
              <tr key={row.id}>
                <td>{formatDate(row.prediction_date)}</td>
                <td>
                  <Badge tone={row.asset === "BTC" ? "warning" : "info"}>{row.asset}</Badge>
                </td>
                <td>{row.horizon} hari</td>
                <td>{formatCurrency(row.predicted_price)}</td>
                <td>{formatCurrency(row.actual_price)}</td>
                <td>{formatPercent(error)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
