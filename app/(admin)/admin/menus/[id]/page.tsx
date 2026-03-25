import { getMenuById } from "@/actions/MenuAction";
import { Card } from "@/components/ui/card";
import MenuBuilder from "./_components/MenuBuilder";
import { handleResponse } from "@/utils/handle-response";
import { Menu } from "@/@types/menu.types";

const MenuBuilderPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { data } = handleResponse<Menu>(await getMenuById(Number(id)));
  return (
    <Card className="w-full">
      <MenuBuilder menu={data} id={Number(id)} />
    </Card>
  );
};

export default MenuBuilderPage;
