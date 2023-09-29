import {
  Anchor,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Divider,
  Group,
  HoverCard,
  Input,
  Menu,
  Modal,
  NavLink,
  Space,
  Text,
} from "@mantine/core";
import { IconSearch, IconStar } from "@tabler/icons";
import { Footer, Header } from "../../components";
import { useEffect, useState } from "react";
import { useClient, useQuery } from "urql";
import { useRouter } from "next/router";

export default function Products() {
  const [keyword, setKeyword] = useState("");
  const [_subcat, setSubCat] = useState("");
  const [_cat, setCat] = useState("");
  const [catsNsubCats, setCatsNSubCats] = useState([]);

  const graphqlClient = useClient();

  const GET_PRODUCTS = `
     query GET_PRODUCTS{
      getProducts{
        id
        name
        category
        subCategory
        image
        specSheet
        description
        removed
        price
      }
    }
  `;

  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: GET_PRODUCTS,
    requestPolicy: "cache-and-network",
  });

  console.log(data);

  const GET_CATSNSUBCATS = `
  query {
  getCatsNSubcats{
    label
    subcategories
  }
}
  `;

  useEffect(() => {
    graphqlClient
      .query(GET_CATSNSUBCATS)
      .toPromise()
      .then(({ data, error }) => {
        if (data && !error) {
          setCatsNSubCats(data?.getCatsNSubcats);
        }
      });
  }, []);

  if (fetching) return <p>Loading ....</p>;
  if (error) return <p>Error ..</p>;

  return (
    <div>
      <Header active="products" />

      <div className="w-full flex max-h-[100vh] overflow-y-auto">
        <div className="space-y-2 w-[20%] bg-gray-100 sticky py-10">
          <NavLink
            label={`All products (${data?.getProducts.length})`}
            onClick={() => {
              setCat("");
              setSubCat("");
            }}
          />
          {catsNsubCats?.map((item, i) => (
            <NavLink
              label={item?.label}
              childrenOffset={28}
              onClick={() => {
                setCat(item?.label);
                setSubCat("");
              }}
              key={i}
            >
              <div className="space-y-2">
                {item?.subcategories.map((subcategory, i) => (
                  <NavLink
                    onClick={() => setSubCat(subcategory)}
                    label={subcategory}
                  />
                ))}
              </div>
            </NavLink>
          ))}
        </div>
        <div className="w-[80%] overflow-x-auto">
          <p className="w-full  text-center tracking-wide uppercase text-[1.2rem] text-black font-extrabold  ">
            Products
          </p>
          <div className="w-[70px] h-[4px] bg-[#d32131]  mx-auto" />
          <Space h={40} />
          <div className="flex justify-between px-4">
            <Breadcrumbs className="text-red-700">
              {_cat && _subcat
                ? ["All products", _cat, _subcat]
                : _cat && !_subcat
                ? ["All products", _cat]
                : ["All products"]}
            </Breadcrumbs>
            <Input
              variant="filled"
              icon={<IconSearch size={16} />}
              placeholder="Search"
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <Space h={40} />
          <div
            className="grid grid-cols-5 px-12 gap-6 mb-12"
            style={{ zIndex: -99 }}
          >
            {data?.getProducts
              .filter((product) => {
                if (_cat && !_subcat) {
                  return product?.category.toLowerCase() == _cat.toLowerCase();
                } else if (_cat && _subcat) {
                  return (
                    product?.category.toLowerCase() == _cat.toLowerCase() &&
                    product?.subCategory.toLowerCase() == _subcat.toLowerCase()
                  );
                } else {
                  return product;
                }
              })
              .filter((product) => {
                if (
                  product?.name.toLowerCase().includes(keyword.toLowerCase()) ||
                  product?.category
                    .toLowerCase()
                    .includes(keyword.toLowerCase()) ||
                  product?.subCategory
                    .toLowerCase()
                    .includes(keyword.toLowerCase())
                ) {
                  return product;
                } else if (!keyword) {
                  return product;
                }
              })
              .map((product, i) => (
                <Product data={product} key={i} refresh={reexecuteQuery} />
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

const Product = ({ data }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Card
        w={"100%"}
        className="hover:scale-110 hover:text-blue-600 hover:cursor-pointer"
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        onClick={() => setModalOpen(true)}
      >
        <Card.Section>
          <img
            src={`${data?.image}`}
            height="100%"
            width="100%"
            alt={data?.name}
          />
        </Card.Section>
        <Text weight={500}>{data?.name}</Text>
      </Card>

      <Modal
        size="90%"
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={<h2 className="text-[1.5rem]">{data?.name}</h2>}
        centered
      >
        {/* Modal content */}
        <div className="flex space-x-12 mt-12">
          <div className="w-1/3">
            <img src={data?.image} alt={data?.name} className="w-full" />
          </div>
          <div className="w-2/3">
            <Breadcrumbs className="text-red-700">
              {[
                new String(data?.category).toUpperCase(),
                new String(data?.subCategory).toUpperCase(),
              ]}
            </Breadcrumbs>
            <Space h={20} />
            <h3 className="text-[1.5rem] mb-2">Features</h3>
            <Text c="dimmed" fz="sm" fw="lighter">
              {data?.description}
            </Text>
            <h3 className="text-[1.5rem] mb-2 mt-6">
              Technical Specifications
            </h3>
            <img src={data?.specSheet} alt={data?.name} className="w-full" />
            {data?.price && (
              <h1 className="text-red-700">
                Ksh.{" "}
                {data?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </h1>
            )}
            <div className="flex flex-row-reverse">
              <Button color="green">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://wa.me/254740650480?text=${encodeURI(
                    `Hello , I would like to get more info about this product '${data?.name}'`
                  )}`}
                >
                  Enquire
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
