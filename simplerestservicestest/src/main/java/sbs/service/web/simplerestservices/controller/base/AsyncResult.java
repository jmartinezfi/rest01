package sbs.service.web.simplerestservices.controller.base;

import java.util.concurrent.Callable;
import java.util.concurrent.ForkJoinPool;

import org.springframework.web.context.request.async.DeferredResult;


public class AsyncResult {

	public static <T> DeferredResult<T> Call(Callable<T> arg, String user) {
		DeferredResult<T> response = new DeferredResult<>();
		ForkJoinPool.commonPool().submit(() -> {
			try {
				response.setResult(arg.call());
			} catch (Exception e) {
				e.printStackTrace();
			} catch (Throwable e) {
				e.printStackTrace();
			}
		});
		return response;
	}

	public static <T> DeferredResult<T> Call(Callable<T> arg) {
		DeferredResult<T> response = new DeferredResult<>();
		ForkJoinPool.commonPool().submit(() -> {
			try {
				response.setResult(arg.call());
			} catch (Exception e) {
				e.printStackTrace();
			} catch (Throwable e) {
				e.printStackTrace();
			}
		});
		return response;
	}

}