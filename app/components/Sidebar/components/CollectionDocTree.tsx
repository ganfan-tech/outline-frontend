import fractionalIndex from "fractional-index";
import { observer } from "mobx-react";
import * as React from "react";
import { useDrop } from "react-dnd";
import { useTranslation } from "react-i18next";
import { useLocation, matchPath, match, Link } from "react-router-dom";
import styled from "styled-components";
import { colorPalette } from "@shared/utils/collections";
import Collection from "~/models/Collection";
import Flex from "~/components/Flex";
import Icon, { IconTitleWrapper } from "~/components/Icon";
import IconPicker from "~/components/IconPicker";
import Error from "~/components/List/Error";
import PaginatedList from "~/components/PaginatedList";
import { createCollection } from "~/actions/definitions/collections";
import useStores from "~/hooks/useStores";
import CollectionLinkChildren from "./CollectionLinkChildren";
import DraggableCollectionLink from "./DraggableCollectionLink";
import DropCursor from "./DropCursor";
import Header from "./Header";
import PlaceholderCollections from "./PlaceholderCollections";
import Relative from "./Relative";
import SidebarAction from "./SidebarAction";
import { DragObject } from "./SidebarLink";

const CollectionDocTree = () => {
  const { documents, collections } = useStores();
  const location = useLocation();

  const [currentCollection, setCurrentCollection] =
    React.useState<Collection | null>(null);

  React.useEffect(() => {
    let m: match<{ collectionId?: string }> | null = null;
    // 第一次匹配
    m = matchPath<{ collectionId?: string }>(location.pathname, {
      path: "/collection/:collectionId",
      exact: false,
      strict: false,
    });
    // 第一次没匹配到，匹配第二次
    if (m === null) {
      m = matchPath<{ collectionId?: string }>(location.pathname, {
        path: "/collection/:collectionId/*",
        exact: false,
        strict: false,
      });
    }
    if (!m) {
      setCurrentCollection(null);
      return;
    }
    const collectionId = m.params.collectionId;
    const cc = collections.all.find(
      (c) => c.id === collectionId || c.path === `/collection/${collectionId}`
    );

    if (!cc) {
      setCurrentCollection(null);
      return;
    }

    setCurrentCollection(cc);

    // 找到cc 以后，再去获取其数据，更新到当前组件
  }, [location, collections.all]);

  React.useEffect(() => {
    async function fetchData() {
      if (currentCollection) {
        await currentCollection.fetchDocuments();
      }
    }
    void fetchData();
  }, [currentCollection]);

  const { t } = useTranslation();
  const orderedCollections = collections.orderedData;

  const params = React.useMemo(
    () => ({
      limit: 100,
    }),
    []
  );

  const [
    { isCollectionDropping, isDraggingAnyCollection },
    dropToReorderCollection,
  ] = useDrop({
    accept: "collection",
    drop: async (item: DragObject) => {
      void collections.move(
        item.id,
        fractionalIndex(null, orderedCollections[0].index)
      );
    },
    canDrop: (item) => item.id !== orderedCollections[0].id,
    collect: (monitor) => ({
      isCollectionDropping: monitor.isOver(),
      isDraggingAnyCollection: monitor.getItemType() === "collection",
    }),
  });

  const handleIconChange = React.useCallback(
    async (icon: string | null, color: string | null) => {
      await currentCollection?.save({ icon, color });
    },
    [currentCollection]
  );

  const fallbackIcon = currentCollection ? (
    <Icon
      value={currentCollection.icon ?? "collection"}
      color={currentCollection.color || undefined}
      size={40}
    />
  ) : null;

  return currentCollection ? (
    <Flex column>
      <Flex>
        <IconTitleWrapper>
          <React.Suspense fallback={fallbackIcon}>
            <IconPicker
              icon={currentCollection.icon ?? "collection"}
              color={currentCollection.color ?? colorPalette[0]}
              initial={currentCollection.name[0]}
              popoverPosition="bottom-start"
              onChange={handleIconChange}
              borderOnHover
            />
          </React.Suspense>
        </IconTitleWrapper>

        <i>
          <Link to={currentCollection.path}>{currentCollection.name}</Link>
        </i>
      </Flex>

      <Relative>
        <CollectionLinkChildren
          collection={currentCollection}
          expanded={true}
        />
      </Relative>
    </Flex>
  ) : (
    <div />
  );

  return (
    <Flex column>
      <Header id="collections" title={t("Collections")}>
        <Relative>
          <PaginatedList
            options={params}
            aria-label={t("Collections")}
            items={collections.allActive}
            loading={<PlaceholderCollections />}
            heading={
              isDraggingAnyCollection ? (
                <DropCursor
                  isActiveDrop={isCollectionDropping}
                  innerRef={dropToReorderCollection}
                  position="top"
                />
              ) : undefined
            }
            renderError={(props) => <StyledError {...props} />}
            renderItem={(item: Collection, index) => (
              <DraggableCollectionLink
                key={item.id}
                collection={item}
                activeDocument={documents.active}
                prefetchDocument={documents.prefetchDocument}
                belowCollection={orderedCollections[index + 1]}
              />
            )}
          />
          <SidebarAction action={createCollection} depth={0} />
        </Relative>
      </Header>
    </Flex>
  );
};

export const StyledError = styled(Error)`
  font-size: 15px;
  padding: 0 8px;
`;

export default observer(CollectionDocTree);
