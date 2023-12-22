import { useRouter } from "next/router";
import React from "react";
import Navbar from "~/components/Navbar";

interface Props {}

const CustomerById: React.FC<Props> = ({}) => {
  const { query } = useRouter();
  return (
    <div className="pt-20">
      <Navbar />
      <div className="w-1/3 max-w-md bg-white h-full p-4 m-4 shadow-lg">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOiEN99uJPX37lOwqYmPy_xs5z8auvTFOANdR7jaxOuA-ItMB8MGPXO45zTpEbZJ_jnvw&usqp=CAU"
          width={300}
          height={200}
          className="rounded-lg border-dashed border-2 border-gray-500 shadow-md opacity-50 bg-white"
        />
        <p className="font-bold text-lg py-4">Joe Toeniskoetter</p>
        <div className="w-full h-[1px] bg-gray-400" />
        <div className="py-4">
          <p>
            <span className="font-bold">Last Service:</span> 12/30/2023
          </p>
          <p>
            <span className="font-bold">Customer #:</span>{" "}
            00b23bf4-6c0b-4ec9-93f9-d0006d2d787c
          </p>
          <p>
            <span className="font-bold">Created:</span> 12/01/2023
          </p>
        </div>
        <div className="w-full h-[1px] bg-gray-400" />
        <div className="py-4">
          <p>
            <span className="font-bold text-lg">Contact Info:</span>
          </p>
          <div className="py-2">
            <p className="text-md text-gray-400 font-bold">Email </p>
            <p>Jtoeniskoetter.jt@gmail.com</p>
          </div>
          <div className="py-2">
            <p className="text-md text-gray-400 font-bold">Phone: </p>
            <p>636-578-5061</p>
          </div>
          <div className="py-2">
            <p className="text-md text-gray-400 font-bold">Address: </p>
            <p>2 Parview Ct.</p>
            <p>Saint Peters, MO 63376</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerById;
