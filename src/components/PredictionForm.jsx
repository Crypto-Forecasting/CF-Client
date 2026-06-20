import Button from "./Button";

const assets = ["BTC", "ETH"];
const horizons = [1, 3, 7];

export default function PredictionForm({ form, onChange, onSubmit, isLoading }) {
  return (
    <form className="prediction-form" onSubmit={onSubmit}>
      <label>
        Aset
        <div className="segmented-control">
          {assets.map((asset) => (
            <button
              type="button"
              className={form.asset === asset ? "is-active" : ""}
              key={asset}
              onClick={() => onChange({ ...form, asset })}
            >
              {asset}
            </button>
          ))}
        </div>
      </label>
      <label>
        Horizon prediksi
        <div className="segmented-control">
          {horizons.map((horizon) => (
            <button
              type="button"
              className={form.horizon === horizon ? "is-active" : ""}
              key={horizon}
              onClick={() => onChange({ ...form, horizon })}
            >
              {horizon} hari
            </button>
          ))}
        </div>
      </label>
      <Button type="submit" isLoading={isLoading}>
        Jalankan Prediksi
      </Button>
    </form>
  );
}
