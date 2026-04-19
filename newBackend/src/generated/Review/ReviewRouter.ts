import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import type { PrismaClient } from "../../../node_modules/@prisma/client";
import {
  ReviewFindUnique,
  ReviewFindUniqueOrThrow,
  ReviewFindFirst,
  ReviewFindFirstOrThrow,
  ReviewFindMany,
  ReviewFindManyPaginated,
  ReviewCreate,
  ReviewCreateMany,
  ReviewCreateManyAndReturn,
  ReviewUpdate,
  ReviewUpdateMany,
  ReviewUpdateManyAndReturn,
  ReviewUpsert,
  ReviewDelete,
  ReviewDeleteMany,
  ReviewAggregate,
  ReviewCount,
  ReviewGroupBy,
} from "./ReviewHandlers.js";
import type { RouteConfig } from "../routeConfig.js";
import { parseQueryParams } from "../parseQueryParams.js";
import { buildModelOpenApi } from "../buildModelOpenApi.js";

const _env =
  typeof process !== "undefined" && process.env
    ? process.env
    : ({} as Record<string, string | undefined>);

const MODEL_FIELDS = [
  {
    name: "id",
    kind: "scalar",
    type: "String",
    isList: false,
    isRequired: true,
    hasDefaultValue: true,
    isUpdatedAt: false,
  },
  {
    name: "userId",
    kind: "scalar",
    type: "String",
    isList: false,
    isRequired: true,
    hasDefaultValue: false,
    isUpdatedAt: false,
  },
  {
    name: "user",
    kind: "object",
    type: "User",
    isList: false,
    isRequired: true,
    hasDefaultValue: false,
    isUpdatedAt: false,
    relationFromFields: ["userId"],
  },
  {
    name: "productId",
    kind: "scalar",
    type: "String",
    isList: false,
    isRequired: true,
    hasDefaultValue: false,
    isUpdatedAt: false,
  },
  {
    name: "product",
    kind: "object",
    type: "Product",
    isList: false,
    isRequired: true,
    hasDefaultValue: false,
    isUpdatedAt: false,
    relationFromFields: ["productId"],
  },
  {
    name: "rating",
    kind: "scalar",
    type: "Int",
    isList: false,
    isRequired: true,
    hasDefaultValue: false,
    isUpdatedAt: false,
  },
  {
    name: "title",
    kind: "scalar",
    type: "String",
    isList: false,
    isRequired: false,
    hasDefaultValue: false,
    isUpdatedAt: false,
  },
  {
    name: "comment",
    kind: "scalar",
    type: "String",
    isList: false,
    isRequired: false,
    hasDefaultValue: false,
    isUpdatedAt: false,
  },
  {
    name: "isApproved",
    kind: "scalar",
    type: "Boolean",
    isList: false,
    isRequired: true,
    hasDefaultValue: true,
    isUpdatedAt: false,
  },
  {
    name: "createdAt",
    kind: "scalar",
    type: "DateTime",
    isList: false,
    isRequired: true,
    hasDefaultValue: true,
    isUpdatedAt: false,
  },
  {
    name: "updatedAt",
    kind: "scalar",
    type: "DateTime",
    isList: false,
    isRequired: true,
    hasDefaultValue: false,
    isUpdatedAt: true,
  },
  {
    name: "deletedAt",
    kind: "scalar",
    type: "DateTime",
    isList: false,
    isRequired: false,
    hasDefaultValue: false,
    isUpdatedAt: false,
  },
] as const;

const MODEL_ENUMS = [] as const;

const defaultOpConfig = {
  before: [] as RequestHandler[],
  after: [] as RequestHandler[],
};

function normalizePrefix(p: string): string {
  if (!p) return "";
  let result = p;
  if (!result.startsWith("/")) result = "/" + result;
  while (result.length > 1 && result.endsWith("/"))
    result = result.slice(0, -1);
  if (result === "/") return "";
  return result;
}

function transformResult(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === "bigint") return value.toString();
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(value)) {
    return value.toString("base64");
  }
  if (value instanceof Uint8Array) {
    let binary = "";
    for (let i = 0; i < value.length; i++)
      binary += String.fromCharCode(value[i]);
    return btoa(binary);
  }
  if (value instanceof Date) return value;
  if (Array.isArray(value)) return value.map(transformResult);
  if (typeof value === "object") {
    const proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null) return value;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = transformResult(v);
    }
    return out;
  }
  return value;
}

function isQueryBuilderEnabled(config: RouteConfig): boolean {
  if (config.queryBuilder === false) return false;
  if (
    typeof config.queryBuilder === "object" &&
    config.queryBuilder.enabled === false
  )
    return false;
  if (_env.NODE_ENV === "production") return false;
  return true;
}

function getQueryBuilderConfig(config: RouteConfig) {
  if (config.queryBuilder === false) return null;
  if (typeof config.queryBuilder === "object") return config.queryBuilder;
  return {};
}

export function ReviewRouter(config: RouteConfig = {}) {
  const router = express.Router();

  router.use(express.json());

  const customPrefix = normalizePrefix(config.customUrlPrefix || "");
  const modelPrefix = config.addModelPrefix !== false ? "/review" : "";
  const basePath = customPrefix + modelPrefix;

  const openApiDisabled =
    config.disableOpenApi === true ||
    (config.disableOpenApi !== false &&
      (_env.DISABLE_OPENAPI === "true" || _env.NODE_ENV === "production"));

  const qbEnabled = isQueryBuilderEnabled(config);

  if (qbEnabled) {
    const qbConfig = getQueryBuilderConfig(config);
    if (qbConfig) {
      import("../queryBuilder.js")
        .then((mod) => mod.startQueryBuilder(qbConfig))
        .catch((err) => {
          if (_env.NODE_ENV !== "production")
            console.warn("[query-builder]", err);
        });
    }
  }

  const parseQuery: RequestHandler = (req, res, next) => {
    const rawQuery = req.query;
    if (rawQuery && Object.keys(rawQuery).length > 0) {
      res.locals.parsedQuery = parseQueryParams(
        rawQuery as Record<string, unknown>,
      );
    }
    next();
  };

  const setShape = (opConfig: any): RequestHandler => {
    return (req, res, next) => {
      res.locals.routeConfig = config;
      if (opConfig.shape) {
        res.locals.guardShape = opConfig.shape;
        const caller =
          config.guard?.resolveVariant?.(req) ??
          req.get(config.guard?.variantHeader || "x-api-variant") ??
          undefined;
        if (caller) {
          res.locals.guardCaller = caller;
        }
      }
      next();
    };
  };

  const respond: RequestHandler = (_req, res) => {
    const data = res.locals.data;
    if (data === undefined) {
      return res.status(500).json({ message: "No data set by handler" });
    }
    return res.json(transformResult(data));
  };

  const respondCreated: RequestHandler = (_req, res) => {
    const data = res.locals.data;
    if (data === undefined) {
      return res.status(500).json({ message: "No data set by handler" });
    }
    return res.status(201).json(transformResult(data));
  };

  if (!openApiDisabled) {
    const openapiJsonPath = basePath
      ? `${basePath}/openapi.json`
      : "/openapi.json";
    const openapiYamlPath = basePath
      ? `${basePath}/openapi.yaml`
      : "/openapi.yaml";

    router.get(openapiJsonPath, (_req, res) => {
      const spec = buildModelOpenApi(
        "Review",
        MODEL_FIELDS as any,
        MODEL_ENUMS as any,
        config,
        { format: "json" },
      );
      res.json(spec);
    });

    router.get(openapiYamlPath, (_req, res) => {
      const spec = buildModelOpenApi(
        "Review",
        MODEL_FIELDS as any,
        MODEL_ENUMS as any,
        config,
        { format: "yaml" },
      );
      res.type("application/yaml").send(spec as string);
    });
  }

  if (config.enableAll || config.findFirst) {
    const opConfig = config.findFirst || defaultOpConfig;
    const { before = [], after = [] } = opConfig;
    const path = basePath ? `${basePath}/first` : "/first";
    router.get(
      path,
      parseQuery,
      setShape(opConfig),
      ...before,
      ReviewFindFirst as RequestHandler,
      ...after,
      respond,
    );
  }

  if (config.enableAll || config.findFirstOrThrow) {
    const opConfig = config.findFirstOrThrow || defaultOpConfig;
    const { before = [], after = [] } = opConfig;
    const path = basePath ? `${basePath}/first/strict` : "/first/strict";
    router.get(
      path,
      parseQuery,
      setShape(opConfig),
      ...before,
      ReviewFindFirstOrThrow as RequestHandler,
      ...after,
      respond,
    );
  }

  if (config.enableAll || config.findManyPaginated) {
    const opConfig = config.findManyPaginated || defaultOpConfig;
    const { before = [], after = [] } = opConfig;
    const path = basePath ? `${basePath}/paginated` : "/paginated";
    router.get(
      path,
      parseQuery,
      setShape(opConfig),
      ...before,
      ReviewFindManyPaginated as RequestHandler,
      ...after,
      respond,
    );
  }

  if (config.enableAll || config.aggregate) {
    const opConfig = config.aggregate || defaultOpConfig;
    const { before = [], after = [] } = opConfig;
    const path = basePath ? `${basePath}/aggregate` : "/aggregate";
    router.get(
      path,
      parseQuery,
      setShape(opConfig),
      ...before,
      ReviewAggregate as RequestHandler,
      ...after,
      respond,
    );
  }

  if (config.enableAll || config.count) {
    const opConfig = config.count || defaultOpConfig;
    const { before = [], after = [] } = opConfig;
    const path = basePath ? `${basePath}/count` : "/count";
    router.get(
      path,
      parseQuery,
      setShape(opConfig),
      ...before,
      ReviewCount as RequestHandler,
      ...after,
      respond,
    );
  }

  if (config.enableAll || config.groupBy) {
    const opConfig = config.groupBy || defaultOpConfig;
    const { before = [], after = [] } = opConfig;
    const path = basePath ? `${basePath}/groupby` : "/groupby";
    router.get(
      path,
      parseQuery,
      setShape(opConfig),
      ...before,
      ReviewGroupBy as RequestHandler,
      ...after,
      respond,
    );
  }

  if (config.enableAll || config.findUniqueOrThrow) {
    const opConfig = config.findUniqueOrThrow || defaultOpConfig;
    const { before = [], after = [] } = opConfig;
    const path = basePath ? `${basePath}/unique/strict` : "/unique/strict";
    router.get(
      path,
      parseQuery,
      setShape(opConfig),
      ...before,
      ReviewFindUniqueOrThrow as RequestHandler,
      ...after,
      respond,
    );
  }

  if (config.enableAll || config.findUnique) {
    const opConfig = config.findUnique || defaultOpConfig;
    const { before = [], after = [] } = opConfig;
    const path = basePath ? `${basePath}/unique` : "/unique";
    router.get(
      path,
      parseQuery,
      setShape(opConfig),
      ...before,
      ReviewFindUnique as RequestHandler,
      ...after,
      respond,
    );
  }

  if (config.enableAll || config.findMany) {
    const opConfig = config.findMany || defaultOpConfig;
    const { before = [], after = [] } = opConfig;
    const path = basePath || "/";
    router.get(
      path,
      parseQuery,
      setShape(opConfig),
      ...before,
      ReviewFindMany as RequestHandler,
      ...after,
      respond,
    );
  }

  if (config.enableAll || config.createManyAndReturn) {
    const opConfig = config.createManyAndReturn || defaultOpConfig;
    const { before = [], after = [] } = opConfig;
    const path = basePath ? `${basePath}/many/return` : "/many/return";
    router.post(
      path,
      setShape(opConfig),
      ...before,
      ReviewCreateManyAndReturn as RequestHandler,
      ...after,
      respondCreated,
    );
  }

  if (config.enableAll || config.createMany) {
    const opConfig = config.createMany || defaultOpConfig;
    const { before = [], after = [] } = opConfig;
    const path = basePath ? `${basePath}/many` : "/many";
    router.post(
      path,
      setShape(opConfig),
      ...before,
      ReviewCreateMany as RequestHandler,
      ...after,
      respondCreated,
    );
  }

  if (config.enableAll || config.create) {
    const opConfig = config.create || defaultOpConfig;
    const { before = [], after = [] } = opConfig;
    const path = basePath || "/";
    router.post(
      path,
      setShape(opConfig),
      ...before,
      ReviewCreate as RequestHandler,
      ...after,
      respondCreated,
    );
  }

  if (config.enableAll || config.updateManyAndReturn) {
    const opConfig = config.updateManyAndReturn || defaultOpConfig;
    const { before = [], after = [] } = opConfig;
    const path = basePath ? `${basePath}/many/return` : "/many/return";
    router.put(
      path,
      setShape(opConfig),
      ...before,
      ReviewUpdateManyAndReturn as RequestHandler,
      ...after,
      respond,
    );
  }

  if (config.enableAll || config.updateMany) {
    const opConfig = config.updateMany || defaultOpConfig;
    const { before = [], after = [] } = opConfig;
    const path = basePath ? `${basePath}/many` : "/many";
    router.put(
      path,
      setShape(opConfig),
      ...before,
      ReviewUpdateMany as RequestHandler,
      ...after,
      respond,
    );
  }

  if (config.enableAll || config.update) {
    const opConfig = config.update || defaultOpConfig;
    const { before = [], after = [] } = opConfig;
    const path = basePath || "/";
    router.put(
      path,
      setShape(opConfig),
      ...before,
      ReviewUpdate as RequestHandler,
      ...after,
      respond,
    );
  }

  if (config.enableAll || config.upsert) {
    const opConfig = config.upsert || defaultOpConfig;
    const { before = [], after = [] } = opConfig;
    const path = basePath || "/";
    router.patch(
      path,
      setShape(opConfig),
      ...before,
      ReviewUpsert as RequestHandler,
      ...after,
      respond,
    );
  }

  if (config.enableAll || config.deleteMany) {
    const opConfig = config.deleteMany || defaultOpConfig;
    const { before = [], after = [] } = opConfig;
    const path = basePath ? `${basePath}/many` : "/many";
    router.delete(
      path,
      setShape(opConfig),
      ...before,
      ReviewDeleteMany as RequestHandler,
      ...after,
      respond,
    );
  }

  if (config.enableAll || config.delete) {
    const opConfig = config.delete || defaultOpConfig;
    const { before = [], after = [] } = opConfig;
    const path = basePath || "/";
    router.delete(
      path,
      setShape(opConfig),
      ...before,
      ReviewDelete as RequestHandler,
      ...after,
      respond,
    );
  }

  router.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = typeof err.status === "number" ? err.status : 500;
    const message = err.message || "Internal server error";
    if (!res.headersSent) {
      return res.status(status).json({ message });
    }
    next(err);
  });

  return router;
}
