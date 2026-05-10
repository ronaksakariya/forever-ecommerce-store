import { useMemo, useState } from "react";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/utils/axiosInstance";

const initialAddressForm = {
  label: "Home",
  name: "",
  email: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  phone: "",
  isDefault: false,
};

const addressFields = [
  { id: "label", label: "Label", autoComplete: "address-line1" },
  { id: "name", label: "Name", autoComplete: "name" },
  { id: "email", label: "Email", type: "email", autoComplete: "email" },
  {
    id: "street",
    label: "Street",
    autoComplete: "street-address",
    wide: true,
  },
  { id: "city", label: "City", autoComplete: "address-level2" },
  { id: "state", label: "State", autoComplete: "address-level1" },
  { id: "zip", label: "Zip", autoComplete: "postal-code" },
  { id: "country", label: "Country", autoComplete: "country-name" },
  { id: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
];

const getActiveUser = (currentUser) => currentUser?.user || currentUser;

const toAddressForm = (address = {}) => ({
  ...initialAddressForm,
  ...address,
  zip: address.zip || address.pincode || "",
  isDefault: Boolean(address.isDefault),
});

const ProfilePage = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const activeUser = getActiveUser(currentUser);
  const addresses = useMemo(() => activeUser?.address || [], [activeUser]);
  const [formData, setFormData] = useState(() => ({
    ...initialAddressForm,
    name: activeUser?.name || "",
    email: activeUser?.email || "",
  }));
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setFormData((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setEditingAddressId(null);
    setFormData({
      ...initialAddressForm,
      name: activeUser?.name || "",
      email: activeUser?.email || "",
    });
  };

  const syncUser = (response) => {
    if (response.data.success) {
      setCurrentUser(response.data.data);
    }
  };

  const submitAddress = async (event) => {
    event.preventDefault();

    const missingField = Object.entries(formData).find(
      ([field, value]) => field !== "isDefault" && !String(value).trim(),
    );

    if (missingField) {
      toast.error("Please fill all address details.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = editingAddressId
        ? await axiosInstance.patch(
            `/api/user/addresses/${editingAddressId}`,
            formData,
          )
        : await axiosInstance.post("/api/user/addresses", formData);

      syncUser(response);
      toast.success(
        editingAddressId ? "Address updated." : "Address saved.",
      );
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save address.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const editAddress = (address) => {
    setEditingAddressId(address._id);
    setFormData(toAddressForm(address));
  };

  const deleteAddress = async (addressId) => {
    try {
      const response = await axiosInstance.delete(
        `/api/user/addresses/${addressId}`,
      );
      syncUser(response);
      if (editingAddressId === addressId) {
        resetForm();
      }
      toast.success("Address deleted.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete address.");
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      const response = await axiosInstance.patch(
        `/api/user/addresses/${addressId}/default`,
      );
      syncUser(response);
      toast.success("Default address updated.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update default address.",
      );
    }
  };

  return (
    <section className="bg-[#FAF9F6] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 border-b border-[#E5E5E5] pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#000000]">
            Account
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-[#000000] sm:text-5xl">
            Profile
          </h1>
          <p className="mt-4 text-sm leading-6 text-[#000000]/70">
            Manage your account details and saved delivery addresses.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <aside className="h-fit rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-[#000000]">
              Account Details
            </h2>
            <div className="mt-6 space-y-4 text-sm">
              <div>
                <p className="text-[#000000]/60">Name</p>
                <p className="mt-1 font-semibold text-[#000000]">
                  {activeUser?.name}
                </p>
              </div>
              <div>
                <p className="text-[#000000]/60">Email</p>
                <p className="mt-1 font-semibold text-[#000000]">
                  {activeUser?.email}
                </p>
              </div>
            </div>
          </aside>

          <div className="space-y-8">
            <section className="rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-[#000000]">
                  Saved Addresses
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="border-[#000000] bg-[#FAF9F6] text-[#000000] hover:bg-[#E5E5E5]"
                >
                  <Plus className="size-4" />
                  New
                </Button>
              </div>

              {addresses.length === 0 ? (
                <p className="mt-6 rounded-lg border border-[#E5E5E5] p-4 text-sm text-[#000000]/70">
                  No saved addresses yet.
                </p>
              ) : (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {addresses.map((address) => (
                    <article
                      key={address._id}
                      className="rounded-lg border border-[#E5E5E5] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5]">
                            <MapPin className="size-4 text-[#000000]/70" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-[#000000]">
                                {address.label}
                              </p>
                              {address.isDefault ? (
                                <span className="rounded-full bg-[#000000] px-2 py-0.5 text-xs text-[#FAF9F6]">
                                  Default
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-2 text-sm text-[#000000]/70">
                              {address.name}
                            </p>
                            <p className="text-sm text-[#000000]/70">
                              {address.street}, {address.city}, {address.state}
                            </p>
                            <p className="text-sm text-[#000000]/70">
                              {address.country} {address.zip || address.pincode}
                            </p>
                            <p className="text-sm text-[#000000]/70">
                              {address.phone}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {!address.isDefault ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setDefaultAddress(address._id)}
                            className="border-[#000000] bg-[#FAF9F6] text-[#000000] hover:bg-[#E5E5E5]"
                          >
                            Set default
                          </Button>
                        ) : null}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => editAddress(address)}
                          className="border-[#000000] bg-[#FAF9F6] text-[#000000] hover:bg-[#E5E5E5]"
                        >
                          <Pencil className="size-4" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAddress(address._id)}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-[#000000]">
                {editingAddressId ? "Edit Address" : "Add Address"}
              </h2>
              <form onSubmit={submitAddress} className="mt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {addressFields.map((field) => (
                    <label
                      key={field.id}
                      htmlFor={`profile-${field.id}`}
                      className={field.wide ? "sm:col-span-2" : undefined}
                    >
                      <span className="text-sm font-medium text-[#000000]">
                        {field.label}
                      </span>
                      <Input
                        id={`profile-${field.id}`}
                        type={field.type || "text"}
                        autoComplete={field.autoComplete}
                        value={formData[field.id]}
                        onChange={(event) =>
                          updateField(field.id, event.target.value)
                        }
                        className="mt-2 h-11"
                      />
                    </label>
                  ))}
                </div>

                <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-[#000000]/80">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(event) =>
                      updateField("isDefault", event.target.checked)
                    }
                    className="size-4 accent-[#000000]"
                  />
                  Make this my default delivery address
                </label>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#000000] text-[#FAF9F6] hover:bg-[#000000]/80"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : editingAddressId
                        ? "Update Address"
                        : "Save Address"}
                  </Button>
                  {editingAddressId ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="border-[#000000] bg-[#FAF9F6] text-[#000000] hover:bg-[#E5E5E5]"
                    >
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
