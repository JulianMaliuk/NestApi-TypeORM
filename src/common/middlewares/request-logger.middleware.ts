import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const logger = new Logger('HTTP_REQUEST', true);
export const requestLogger = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { method, originalUrl: url } = req;
  if (!url.match(/^\/api\/.*/)) return next();
  const userAgent = req.get('user-agent') || '';

  res.on('close', () => {
    const { statusCode, statusMessage } = res;
    const contentLength = res.get('content-length');
    logger.log(
      `"${method} ${url}" ${statusCode} ${statusMessage} ${contentLength} "${userAgent}"`,
    );
  });
  next();
};
