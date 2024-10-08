import "./styles.css";
import { Box, Button, CircularProgress } from "@mui/material";
import React, { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useInspectionOrderDetails } from "../../hooks/useInspectionOrderDetails";
import { useInspectionOrder } from "../../hooks/useInspectionOrder";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";
import { ArrowCircleLeftOutlined, Print } from "@mui/icons-material";
import { useProfile } from "../../hooks/useProfile";

export const ReviewAndFinish: React.FC = () => {
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const { id } = useParams();
  const { data: profile } = useProfile({ enabled: true });
  const { data: apiDetails, isLoading: loadingDetail } =
    useInspectionOrderDetails({
      id: id ?? "",
    });
  const { data: order, isLoading: loadingOrder } = useInspectionOrder({
    id: id ?? "",
    relations: ["signatures", "template"],
  });

  if (loadingDetail || loadingOrder) {
    return <CircularProgress />;
  }

  return (
    <>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        m={2}
        gap={2}
      >
        <Link to={"/dashboard/inspections"}>
          <Button variant="outlined" startIcon={<ArrowCircleLeftOutlined />}>
            Back to Inspections
          </Button>
        </Link>
        <Button variant="outlined" onClick={handlePrint} startIcon={<Print />}>
          Print Report
        </Button>
      </Box>
      <div ref={componentRef} className="main-container">
        <div className="container">
          <header className="header">
            <h1 className="title">Inspection Report</h1>
            <p>
              <strong>Date:</strong>{" "}
              {format(new Date(order?.createdAt ?? ""), "MM/dd/yyyy")}
            </p>
            <p>
              <strong>Inspected By:</strong> {profile?.company?.name}
            </p>
          </header>

          <section className="section">
            <h2 className="subtitle">Customer Information</h2>
            <p>
              <strong>Name:</strong> {order?.customerName}
            </p>
            <p>
              <strong>Address:</strong>
              <p>
                {order?.address} <br /> {order?.city}, {order?.state}{" "}
                {order?.zip}
              </p>
            </p>
            <p>
              <strong>Inspection Level:</strong>{" "}
              {order?.template?.inspectionLevel}
            </p>
          </section>

          <section className="section">
            <h2 className="subtitle">Inspection Details</h2>
            <table className="pdf-table">
              <thead>
                <tr>
                  <th className="pdf-table-th pdf-table-th-td">Item</th>
                  <th className="pdf-table-th pdf-table-th-td">Condition</th>
                  <th className="pdf-table-th pdf-table-th-td">Reason</th>
                  <th className="pdf-table-th pdf-table-th-td">Photo</th>
                </tr>
              </thead>
              <tbody>
                {apiDetails?.map((od, idx) => {
                  return (
                    <tr>
                      <td className="pdf-table-th">{od.item}</td>
                      <td className="pdf-table-th">
                        <strong>{od.condition?.name}</strong>
                      </td>
                      <td className="pdf-table-th">
                        {od.condition?.description}
                      </td>
                      <td className="pdf-table-th">
                        {od.photoUrl && <p>See figure {idx + 1}</p>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <section className="section">
            {apiDetails?.map((od, idx) => {
              return (
                od.photoUrl && (
                  <div style={{ width: "100%" }}>
                    <figure className="inspection-figure">
                      <figcaption>
                        Figure: {idx + 1} - {od.item}
                        <br />
                        {od.notes}
                      </figcaption>
                      <img
                        key={od.id}
                        src={od.photoUrl}
                        alt="Photo of {{area}}"
                        style={{ borderRadius: 5, height: 400 }}
                      />
                    </figure>
                  </div>
                )
              );
            })}
          </section>

          {(order?.template?.signaturesRequired ||
            (order?.signatures && order?.signatures.length > 0)) && (
            <section className="signature">
              <div>
                <p>Technician Signature</p>
                {order.signatures?.find((s) =>
                  s.type.includes("technician")
                ) && (
                  <img
                    src={
                      order.signatures?.find((s) =>
                        s.type.includes("technician")
                      )?.imageUrl
                    }
                    alt="Technician's Signature"
                  />
                )}
              </div>
              <div>
                <p>Customer Signature</p>
                {order.signatures?.find((s) =>
                  s.type.includes("technician")
                ) && (
                  <img
                    src={
                      order.signatures?.find((s) => s.type.includes("customer"))
                        ?.imageUrl
                    }
                    alt="Customer's Signature"
                  />
                )}
              </div>
            </section>
          )}

          <footer className="footer">
            <p>Powered by SweepInspectr.</p>
          </footer>
        </div>
      </div>
    </>
  );
};
