import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
 TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit, Trash2, MoreHorizontal, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

import {
  createProduct,
  updateProduct,
  deleteProduct,
  fetchProducts,
  selectAllProducts,
  selectProductsStatus,
} from "@/store/slices/productSlice";

import { Product, ProductFormData } from "@/types";
import { fetchCategories, selectAllCategories } from "@/store/slices/categorySlice";
import { Category } from "@/types";

// ------------------------------
// Add/Edit Product Form Component
// ------------------------------
interface ProductFormProps {
  product: Product | null;
  onSave: (product: ProductFormData) => void;
  onClose: () => void;
}

const ProductForm = ({ product, onSave, onClose }: ProductFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(selectAllCategories);
  const [formData, setFormData] = useState<ProductFormData>(
    product
      ? { ...product }
      : {
          name: "",
          brand: "",
          category: "",
          subcategory: "",
          description: "",
          price: 0,
          originalPrice: 0,
          inStock: true,
          isBestseller: false,
          isNew: false,
          image: [],
          features: [],
        }
  );

  // Load categories from Redux store
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Helper function to get category name by ID
  const getCategoryName = (categoryId: string) => {
    if (!categories || categories.length === 0) return categoryId;
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : categoryId;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      // Coerce number inputs to numbers to avoid string prices
      if (type === "number") {
        const num = value === "" ? 0 : Number(value);
        return { ...prev, [name]: isNaN(num) ? 0 : num } as typeof prev;
      }
      return { ...prev, [name]: type === "checkbox" ? checked : value } as typeof prev;
    });
  };

  // multiple image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    // Convert to Data URLs so they persist in localStorage (blob: URLs break after refresh)
    const toDataUrl = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });
    try {
      const dataUrls = await Promise.all(files.map(toDataUrl));
      setFormData((prev) => ({
        ...prev,
        image: [...prev.image, ...dataUrls],
      }));
    } catch (err) {
      console.error('Failed to read images', err);
      toast.error('Failed to read one or more images');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name.trim()) {
      alert('Product name is required');
      return;
    }
    if (!formData.brand.trim()) {
      alert('Brand is required');
      return;
    }
    if (!formData.category) {
      alert('Please select a category');
      return;
    }
    if (!formData.description.trim()) {
      alert('Description is required');
      return;
    }
    if (formData.price <= 0) {
      alert('Price must be greater than 0');
      return;
    }
    if (formData.originalPrice > 0 && formData.originalPrice < formData.price) {
      alert('Original price must be greater than or equal to current price');
      return;
    }
    
    // Set originalPrice to 0 if empty to avoid validation issues
    // Add default inventory data
    const productData = {
      ...formData,
      originalPrice: formData.originalPrice || 0,
      inventory: {
        quantity: 100,
        lowStockThreshold: 10,
        trackInventory: true
      },
      status: 'active'
    };
    
    onSave(productData);
    onClose();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
      </DialogHeader>

      <div className="grid gap-3 max-h-[70vh] overflow-y-auto pr-2">
        <Input
          placeholder="Product Name *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          placeholder="Brand *"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          required
        />
        <select
          name="category"
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="border rounded-lg px-3 py-2 text-sm"
          required
        >
          <option value="">Select Category *</option>
          {Array.isArray(categories) && categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Subcategory"
          name="subcategory"
          value={formData.subcategory}
          onChange={handleChange}
        />
        <Input
          placeholder="Description *"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <Input
          placeholder="Enter price (e.g., 1500.00)"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="any"
          className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
          required
        />
        <Input
          placeholder="Enter original price (optional, e.g., 2000.00)"
          name="originalPrice"
          type="number"
          value={formData.originalPrice}
          onChange={handleChange}
          min="0"
          step="any"
          className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
        />

        {/* Multiple Image Upload */}
        <div>
          <label className="text-sm font-medium">Upload Images</label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="mt-1"
          />

          {formData.image.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {formData.image.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
          />
          In Stock
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isBestseller"
            checked={formData.isBestseller}
            onChange={handleChange}
          />
          Bestseller
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isNew"
            checked={formData.isNew}
            onChange={handleChange}
          />
          New Product
        </label>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-gradient-orange text-white"
        >
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

// ------------------------------
// Product Details View Component
// ------------------------------
interface ProductViewProps {
  product: Product;
  onClose: () => void;
}

const ProductView = ({ product, onClose }: ProductViewProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{product.name}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4">
        {(product.images || product.image)?.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {(product.images || product.image)!.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={product.name}
                className="w-full h-32 object-cover rounded-lg border"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No images uploaded</p>
        )}

        <p>
          <strong>Brand:</strong> {product.brand}
        </p>
        <p>
          <strong>Category:</strong> {getCategoryName(product.category)}
        </p>
        <p>
          <strong>Description:</strong> {product.description}
        </p>
        <p>
          <strong>Price:</strong> Rs:{product.price}
        </p>
        {product.originalPrice > 0 && (
          <p className="text-muted-foreground">
            <s>Rs:{product.originalPrice}</s>
          </p>
        )}
        <p>
          <strong>Status:</strong>{" "}
          {product.inStock ? "In Stock" : "Out of Stock"}
        </p>
      </div>
      <DialogFooter>
        <Button onClick={onClose} variant="outline">
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

// ------------------------------
// Main Products Table Component
// ------------------------------
const ProductsTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectAllProducts);
  const { status, error } = useSelector(selectProductsStatus);
  const categories = useSelector(selectAllCategories);

  // Fetch products and categories on component mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
    dispatch(fetchCategories());
  }, [dispatch, status]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // Helper function to get category name by ID
  const getCategoryName = (categoryId: string) => {
    if (!categories || categories.length === 0) return categoryId;
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : categoryId;
  };

  // filtering with null check
  const filteredProducts = (products || []).filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory ? p.category === filterCategory : true)
  );

  // Handle save (add/edit)
  const handleSaveProduct = async (productData: ProductFormData) => {
    try {
      if (editingProduct) {
        const updatedProduct: Product = {
          ...editingProduct,
          ...productData,
          updatedAt: new Date().toISOString(),
        };
        await dispatch(updateProduct(updatedProduct)).unwrap();
        toast.success("Product updated successfully");
      } else {
        await dispatch(createProduct(productData)).unwrap();
        toast.success("Product created successfully");
      }
      setOpenDialog(false);
      setEditingProduct(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save product";
      toast.error(errorMessage);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        toast.success("Product deleted successfully");
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  return (
    <Card className="card-elegant">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Product Management</h2>
          <Button
            className="bg-gradient-orange text-white"
            onClick={() => {
              setEditingProduct(null);
              setOpenDialog(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Categories</option>
            {Array.isArray(categories) && categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading state */}
      {status === "loading" && (
        <div className="p-4 text-center text-muted-foreground">
          Loading products...
        </div>
      )}

      {/* Error state */}
      {status === "failed" && (
        <div className="p-4 text-center text-destructive">
          Failed to load products. {error}
        </div>
      )}

      {/* Products table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={
                        (product.images || product.image) && (product.images || product.image)!.length > 0
                          ? (product.images || product.image)![0]
                          : "/placeholder.svg"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.brand}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="capitalize">{getCategoryName(product.category)}</TableCell>
              <TableCell>Rs:{product.price}</TableCell>
              <TableCell>
                <Badge
                  className={
                    product.inStock
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </TableCell>
              <TableCell>
                {product.isNew ? (
                  <Badge className="bg-purple-100 text-purple-800">New</Badge>
                ) : product.isBestseller ? (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Bestseller
                  </Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setViewingProduct(product)}
                    >
                      <Eye className="mr-2 h-4 w-4" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingProduct(product);
                        setOpenDialog(true);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add/Edit Product Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        {openDialog && (
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onClose={() => setOpenDialog(false)}
          />
        )}
      </Dialog>

      {/* View Product Dialog */}
      <Dialog
        open={!!viewingProduct}
        onOpenChange={() => setViewingProduct(null)}
      >
        {viewingProduct && (
          <ProductView
            product={viewingProduct}
            onClose={() => setViewingProduct(null)}
          />
        )}
      </Dialog>
    </Card>
  );
};

export default ProductsTable;