import Layout from "../../../Layout/Layout";
import "./Products.css";
import InputField from "../../../Components/InputField/InputField" ;
import InputDropdown from "../../../Components/InputDropdown/InputDropdown" ;
import TableWithPagi from '../../../Components/Tables/TableWithPagi';
import Buttons  from '../../../Components/Buttons/Buttons';
//import { BuildTwoTone } from "@mui/icons-material";

export const Products = () => {
    return (
        <>
            <div className="products">
                <h4>Products</h4>
            </div>
            <Layout>
                <div className="registered-products">
                <h2 className="reg-product">Registered Products</h2>
                
                     <table className="product-table" style={{ border: "none" }} >
                        <thead>
                        <tr>
                            <th>Branch</th>
                            <th>Category</th>
                            <th>Product ID / Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            
                            <td><InputDropdown options= {["Galle","Colombo", "Kalutara"]} id="branch" name="branch" placeholder="Galle" editable={true} height="12em" width="15em"  required></InputDropdown></td>
                            <td><InputField type="text" id="category" name="category" editable={true} height="3em" width="15em"  required></InputField></td>
                            <td><InputField type="text" id="Product ID / Name" name="Product ID / Name" editable={true} height="3em" width="15em"  required></InputField></td>
                        </tr>
                        </tbody>
                    </table>

                    <div className="search-bar">
                    <Buttons type="submit" id="Search"  style={{ backgroundColor: "#23A3DA", color: "white" }}> Search </Buttons>
                    <Buttons type="submit" id="Clear"  style={{ backgroundColor: "white", color: "red" }}> Clear </Buttons>
                    <Buttons type="submit" id="New +"  style={{ backgroundColor: "white", color: "#23A3DA" }}> New +  </Buttons>
                        {/* <Buttons type="button" onClick={handleSearch} style={{backgrounfColor: "blue", color: "white"}}>Search</Buttons> Add the Buttons component for search */}
                        {/* <Buttons type="button" onClick={handleClear}>Clear</Buttons> {/* Add the Buttons component for clear */}
                        {/* <Buttons type="button" onClick={handleNew}>New +</Buttons> Add the Buttons component for new */} 
                    </div>
{/*                     
                    <div className="search-bar">
                        
                        <button type="button">Search</button>
                        <button type="button">Clear</button>
                        <button type="button">New +</button>

                    </div> */}
                    <TableWithPagi
                        columns={['Branch Name', 'Product ID', 'Product Name', 'Product Category', 'Size', 'Description', 'Supplier Name']}
                        rows={[
                            { branch: 'Galle', productId: 'P10035', productName: 'Sustagen Vanilla 400g', category: 'Milk Powder', size: '400g', description: 'This is Sustagen Vanilla milk powder', SupplierName: 'Hemas Pharmaceuticals Pvt Ltd'  },
                            { branch: 'Galle', productId: 'P10036', productName: 'Nestamailt Pouch', category: 'Milk Powder', size: '600g', description: 'This is Sustagen Vanilla milk powder', SupplierName: 'Nesle Lanka PLC'  },
                            { branch: 'Galle', productId: 'P10037', productName: 'Milo Packet', category: 'Milk Powder', size: '400g', description: 'This is Sustagen Vanilla milk powder', SupplierName: 'Nesle Lanka PLC'  },
                            { branch: 'Galle', productId: 'P10038', productName: 'Anchor Packet', category: 'Milk Powder', size: '1200g', description: 'This is Sustagen Vanilla milk powder',  SupplierName: 'Fontera Lanka'  },
                            
                            
                            
                        ]}
                    />
                       
                       
                    
                    <div className="adjust-price">
                    <h2 className="adj-prc">Adjust Product's Price</h2>
                    <table className="adjust-product-price" style={{ border: "none" }} >
                        <thead>
                        <tr>
                            <th>Branch</th>
                            <th>Search Product ID / Name</th>
                    
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            
                            <td><InputDropdown options= {["Galle","Colombo", "Kalutara"]} id="branch" name="branch" placeholder="-Select" editable={true} height="12em" width="15em"  required></InputDropdown></td>
                            <td><InputField type="text" id="productId" name="productId" editable={true} height="3em" width="15em"  required></InputField></td>
                            
                        </tr>
                        <tr>
                            <th>Batch No</th>
                            <th>Unit Price</th>
                        </tr>
                        <tr>
                            <td><InputField type="text" id="batchNo" name="batchNo" editable={true} height="3em" width="15em"  required></InputField></td>
                            <td><InputField type="text" id="unitPrice" name="unitPrice" editable={true} height="3em" width="15em"  required></InputField></td>
                        </tr>
                        </tbody>
                    </table>


                        {/* <h2>Adjust Product's Price</h2>
                        <InputDropdown options= {[ "Galle","Colombo", "Kalutara"]} id="branch" name="branch" placeholder="-Select" editable={true} height="3em" width="15em"  required></InputDropdown>
                        {/* <select>
                        <option value="">-Select-</option>
                        </select> */}

                        {/* <div className="search-bar">
                        <input type="text" placeholder="Search Product ID / Name" />
                    </div>

                        <input type="text" placeholder="Batch No" />
                        <input type="text" placeholder="Unit Price" />  */}
                        <Buttons type="button" onClick={handleUpdate}>Update</Buttons> {/* Add the Buttons component for update */}
                        {/* <button type="button">Update</button> */}
                    </div>
                </div>
            </Layout>
        </>

    );
};

// const handleSearch = () => {
//     // Add logic for search button click
// };

// const handleClear = () => {
//     // Add logic for clear button click
// };

// const handleNew = () => {
//     // Add logic for new button click
// };

const handleUpdate = () => {
    // Add logic for update button click
};