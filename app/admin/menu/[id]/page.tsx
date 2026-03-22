import { getMenuById } from "@/actions/MenuAction";
import { Card } from "@/components/ui/card";
import MenuBuilder from "./_components/MenuBuilder";

const MenuBuilderPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const menu = await getMenuById(Number(id));
  if (!menu?.success) throw new Error(menu?.message);
  return (
    <Card className="w-full">
      <MenuBuilder menu={menu?.data} id={Number(id)} />
    </Card>
  );
};

export default MenuBuilderPage;
